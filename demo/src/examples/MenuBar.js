<div>
  <div style={{ backgroundColor: '#f8f8f8', height: '300px', border: '1px solid #eee'}}>
    <MenuBar
      menu={[
        {
          text: 'File',
          submenu: [
            { text: 'New', hotkey:"mod+n", icon: 'add', onClick: () => alert('New file'), tooltip: 'May use tooltips' },
            { text: 'Open...', hotkey:"mod+o", icon: 'document', onClick: () => alert('Open file') },
            { divider: '' },
            { text: 'Quit', hotkey:"mod+q", icon: 'log-out', onClick: () => alert('Quit') },
          ]
        },
        {
          text: 'Edit',
          submenu: [
            { text: 'Cut', hotkey:"mod+x", icon: 'cut', onClick: () => alert('Cut') },
            { text: 'Copy', hotkey:"mod+c", icon: 'duplicate', onClick: () => alert('Copy') },
            { text: 'Paste', hotkey:"mod+v", icon: 'clipboard', onClick: () => alert('Paste') },
            { divider: '' },
            { text: 'Other',
              submenu: [
                { text: 'Some command 1', label: 'Label', icon: 'code', onClick: () => alert('Do something') },
                { text: 'Some command 2', icon: 'numerical', onClick: () => alert('Do something else') },
              ]
            },
          ]
        },
        { text: 'No Submenu', onClick: () => alert('This triggers an action directly')}
      ]}
    />
  </div>
  <br/>
  <p>
    The <code>menu</code> prop must be an array of objects with <code>text</code> and
    <code>submenu</code> properties. Each <code>submenu</code> is itself an
    array of item descriptor objects or <code>MenuItem</code> elements.
    Item descriptors may contain several properties, namely <code>text</code>,
    <code>icon</code>, <code>label</code>, <code>hotkey</code>, <code>onClick</code>,
    <code>tooltip</code>, <code>key</code>, <code>divider</code>, and
    <code>submenu</code>. Check the <code>createMenu()</code> util for more details.
  </p>
</div>
