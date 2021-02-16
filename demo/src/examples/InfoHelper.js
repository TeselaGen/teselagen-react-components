import { Classes } from '@blueprintjs/core';
import React from 'react'
import InfoHelper from '../../../src/InfoHelper'

export default () => (
  <div>
    Default:
    <br />
    <InfoHelper
      content={
        "Hey I'm some helpful info! And I'm some really long helpful info.. This should wrap lines"
      }
    />
    As Button disabled:
    <br />
    <InfoHelper isButton disabled content={"Hey I'm some helpful info!"} />
    <br />
    inline:
    <InfoHelper isInline color="red" content={"Hey I'm some helpful info!"} />
    <br />
    <br />
    <br />
    displayToSide :
    <br />
    <InfoHelper displayToSide content={"Hey I'm some helpful info!"} />
    <br />
    clickable and displayToSide :
    <br />
    <InfoHelper
      displayToSide
      clickable
      content={"Hey I'm some helpful info!"}
    />
    <br />
    As different icon (icon="align-left"):
    <br />
    <InfoHelper icon="align-left" content={"Hey I'm some helpful info!"} />
    With color (color="blue"):
    <br />
    <InfoHelper
      color="blue"
      icon="align-left"
      content={"Hey I'm some helpful info!"}
    />
    <br />
    As Button (isButton=true):
    <br />
    <InfoHelper
      isButton
      intent="primary"
      text="Hello world!"
      icon="align-left"
      content={"Hey I'm some helpful info!"}
    />
    <br />
    size=45
    <br />
    <InfoHelper
      size={45}
      color="green"
      content={"Hey I'm some helpful info!"}
    />
    <br />
    isPopover=true
    <br />
    <InfoHelper isPopover content={"Hey I'm some helpful info!"} />
    <br />
    isPopover=true size=30
    <br />
    <InfoHelper size={30} isPopover content={"Hey I'm some helpful info!"} />
    <br />
    absolute positioned!
    <br />
    <InfoHelper
      className={Classes.LARGE}
      isPopover
      content={"Hey I'm some helpful info!"}
    />
    <br />
    <div
      style={{
        position: "relative",
        height: 300,
        width: 300,
        background: "lightgrey"
      }}
    >
      <InfoHelper
        content={"Hey I'm some helpful info!"}
        style={{ position: "absolute", right: 0, bottom: 0 }}
      />
    </div>
    Long Info:
    <br />
    <InfoHelper
      content={
        "Hey I'm some helpful info!  aiojeifj oiwjefia ofja iowjef aoiwejfoiajweif jawfo joaiwefjaiw faoiwjf ioawjef awoefijawioefj awofj oawjf oawj efojafoaj eofijawiofjaiw efaoiwjefoiawjioef aiojeifj oiwjefia ofja iowjef aoiwejfoiajweif jawfo joaiwefjaiw faoiwjf ioawjef awoefijawioefj awofj oawjf oawj efojafoaj eofijawiofjaiw efaoiwjefoiawjioef aiojeifj oiwjefia ofja iowjef aoiwejfoiajweif jawfo joaiwefjaiw faoiwjf ioawjef awoefijawioefj awofj oawjf oawj efojafoaj eofijawiofjaiw efaoiwjefoiawjioef aiojeifj oiwjefia ofja iowjef aoiwejfoiajweif jawfo joaiwefjaiw faoiwjf ioawjef awoefijawioefj awofj oawjf oawj efojafoaj eofijawiofjaiw efaoiwjefoiawjioef aiojeifj oiwjefia ofja iowjef aoiwejfoiajweif jawfo joaiwefjaiw faoiwjf ioawjef awoefijawioefj awofj oawjf oawj efojafoaj eofijawiofjaiw efaoiwjefoiawjioef aiojeifj oiwjefia ofja iowjef aoiwejfoiajweif jawfo joaiwefjaiw faoiwjf ioawjef awoefijawioefj awofj oawjf oawj efojafoaj eofijawiofjaiw efaoiwjefoiawjioef"
      }
    />
  </div>
);
