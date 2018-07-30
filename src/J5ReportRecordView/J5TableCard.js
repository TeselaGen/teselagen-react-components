import React from "react";
import { Button } from "@blueprintjs/core";
import { camelCase } from "lodash";
import CollapsibleCard from "../CollapsibleCard";
import InfoHelper from "../InfoHelper";
import DataTable from "../DataTable";

function J5TableCard({
  title,
  helperMessage,
  entities,
  tableProps,
  schema,
  showLinkModal,
  onDoubleClick,
  isLinkable,
  cellRenderer,
  openTitleElements,
  linkButtonText,
  children
}) {
  return (
    <CollapsibleCard
      icon={helperMessage && <InfoHelper>{helperMessage}</InfoHelper>}
      title={title}
      initialClosed={!entities.length}
      openTitleElements={[
        isLinkable && (
          <Button onClick={() => showLinkModal()}>
            {linkButtonText || `Link ${title}`}
          </Button>
        ),
        ...openTitleElements
      ]}
    >
      <DataTable
        {...tableProps}
        schema={schema}
        onDoubleClick={onDoubleClick}
        formName={camelCase(title)} //because these tables are currently not connected to table params, we need to manually pass a formName here
        cellRenderer={cellRenderer}
        entities={entities}
      />
      {children}
    </CollapsibleCard>
  );
}

export default J5TableCard;
