import { Button } from '@blueprintjs/core';
import React from 'react'
import CollapsibleCard from '../../../src/CollapsibleCard'

export default () =><CollapsibleCard
  title="Jobs"
  openTitleElements={<Button text="hey" icon="add" />}
  icon="build"
>
  I'm some content!
</CollapsibleCard>;

