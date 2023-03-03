import { Button, Textarea } from '@fluentui/react-components';
import React, { useState } from "react";
import { useSyncState } from '@hooks/useSyncState';
import "@/style.css";
import view from '@/core/view';

const Settings = () => {
  const [avatar, setAvatar] = useSyncState('avatar', 'https://hello.png');
  return (<div>
    <h1>Settings</h1>

    <Textarea onChange={(e, data) => { console.log('e:', e, data) }} />
    <div>avatar:{avatar}</div>
    <Button appearance="primary" onClick={() => { setAvatar("https://new.png") }}>
      click Me
    </Button>
  </div>)
}


view.render(<Settings></Settings>);
