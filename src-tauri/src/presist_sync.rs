use std::collections::HashMap;
use std::collections::HashSet;
use std::sync::Arc;
use std::sync::Mutex;
use tauri::{
    plugin::{Builder, TauriPlugin},
    Manager, Runtime,
};

#[derive(Clone, serde::Serialize, serde::Deserialize, Debug)]
pub struct Payload {
    label: String,
    key: String,
}

#[derive(Debug)]
pub struct PresistSync {
    key_labels: HashMap<String, HashSet<String>>,
}

impl PresistSync {
    pub fn new() -> Self {
        Self {
            key_labels: HashMap::new(),
        }
    }

    pub fn register(&mut self, payload: &Payload) {
        let key = payload.key.to_string();
        let label = payload.label.to_string();

        if !self.key_labels.contains_key(&key) {
            self.key_labels.insert(key.clone(), HashSet::new());
        }
        if !self.key_labels[&key].contains(&label) {
            if let Some(x) = self.key_labels.get_mut(&key) {
                x.insert(label.to_string());
            }
        }

        println!("register map:{:?}", self.key_labels);
    }

    pub fn get_dispatch(&self, payload: &Payload) -> Vec<String> {
        let key = payload.key.to_string();
        let from = payload.label.to_string();

        let mut result = Vec::new();
        if self.key_labels.contains_key(&key) {
            for label in self.key_labels[&key].iter() {
                if from != *label {
                    result.push(label.clone());
                }
            }
        }
        result
    }
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("presist_sync")
        .setup(|app| {
            // let windows = app.windows();
            // let keys: Vec<String> = windows.into_keys().collect();
            // println!("windows: {:?}", keys);

            app.listen_global("tauri://created", |event| {
                println!("tauri://created{:?}", event);
            });
            // let app = Arc::new(app);
            let presist_sync = Arc::new(Mutex::new(PresistSync::new()));

            // listen to the `event-name` (emitted on any window)
            let register_ps = Arc::clone(&presist_sync);
            app.listen_global("presist-register", move |event| {
                let mut register_ps = register_ps.lock().unwrap();
                match event.payload() {
                    None => (),
                    Some(v) => {
                        let payload: Payload = serde_json::from_str(v).unwrap();
                        println!("register:{:?}", payload);
                        register_ps.register(&payload)
                    }
                };
            });

            let app_handle = app.clone();
            let dispatch_ps = Arc::clone(&presist_sync);
            app.listen_global("presist-dispatch", move |event| {
                let dispatch_ps = dispatch_ps.lock().unwrap();

                match event.payload() {
                    None => (),
                    Some(v) => {
                        let payload: Payload = serde_json::from_str(v).unwrap();

                        println!("get_dispatch:{:?}", &payload);
                        let dispatchers = dispatch_ps.get_dispatch(&payload);
                        for label in dispatchers {
                            println!("presist-sync:{:?}", &label);
                            app_handle
                                .emit_to(
                                    label.as_str(),
                                    "presist-sync",
                                    Payload {
                                        key: payload.key.clone(),
                                        label: payload.label.clone(),
                                    },
                                )
                                .unwrap();
                        }
                    }
                };
            });

            Ok(())
        })
        .build()
}
