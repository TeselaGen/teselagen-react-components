import React, { Component } from "react";
// import EditViewHOC from '../../EditViewHOC'
import { reduxForm } from "redux-form";
import { Button, Dialog } from "@blueprintjs/core";
import {
  each,
  get,
  startCase,
  times,
  zip,
  flatten,
  noop,
  flatMap
} from "lodash";
import moment from "moment";
import CollapsibleCard from "../CollapsibleCard";
import InfoHelper from "../InfoHelper";
import schemas from "./schemas";
import DataTable from "../DataTable";
import Loading from "../Loading";
import { getLinkDialogProps } from "./utils";
import { getRangeLength } from "ve-range-utils";
import papaparse from "papaparse";
import magicDownload from "../DownloadLink/magicDownload";
import exportOligosFields from "./exportOligosFields";
import getSequenceStringOfJ5InputPart from "./getSequenceStringOfJ5InputPart";
import "./style.css";

const sharedTableProps = {
  withSearch: false,
  isInfinite: true,
  maxHeight: 400,
  withDisplayOptions: true,
  hidePageSizeWhenPossible: true,
  doNotShowEmptyRows: true,
  isLoading: false,
  urlConnected: false
};

const processInputParts = inputParts =>
  inputParts.map(inputPart => {
    const sequencePart = get(inputPart, "sequencePart", {});
    return {
      ...inputPart,
      sequencePart: {
        ...sequencePart,
        id: "part_" + sequencePart.id
      },
      size: getRangeLength(
        {
          start: inputPart.sequencePart.start,
          end: inputPart.sequencePart.end
        },
        get(inputPart, "sequencePart.sequence.size")
      ),
      bps: getSequenceStringOfJ5InputPart(inputPart)
    };
  });

function getWrappedInParensMatches(s) {
  const matches = [];
  s.replace(/\((.*?)\)/g, function(g0, g1) {
    matches.push(g1);
  });
  return matches;
}

const processJ5DirectSyntheses = j5DirectSynths =>
  j5DirectSynths.map(j5DirectSynth => {
    return {
      ...j5DirectSynth,
      id: "dna_syn_" + j5DirectSynth.id,
      bps: get(j5DirectSynth, "sequence.sequenceFragments", [])
        .map(f => f.fragment)
        .join("")
    };
  });

const processJ5RunConstructs = j5RunConstructs =>
  j5RunConstructs.filter(j5RunConstruct => !j5RunConstruct.isPrebuilt).map(j5RunConstruct => ({
    ...j5RunConstruct,
    id: "construct_" + j5RunConstruct.id,
    nextLevelParts: (get(j5RunConstruct, "sequence.sequenceParts") || [])
      .map(part => part.name)
      .join(", "),
    partsContainedNames:
      get(
        j5RunConstruct,
        "j5ConstructAssemblyPieces[0].assemblyPiece.j5AssemblyPieceParts[0].j5InputPart.sequencePart.name"
      ) &&
      flatMap(
        j5RunConstruct.j5ConstructAssemblyPieces,
        j5ConstructAssemblyPiece =>
          j5ConstructAssemblyPiece.assemblyPiece.j5AssemblyPieceParts.map(
            j5InputPart => j5InputPart.j5InputPart.sequencePart.name
          )
      ).join(", ")
  }));

const processPrebuiltConstructs = j5RunConstructs =>
  j5RunConstructs.filter(j5RunConstruct => j5RunConstruct.isPrebuilt).map(j5RunConstruct => ({
    ...j5RunConstruct,
    id: "construct_" + j5RunConstruct.id,
    nextLevelParts: (get(j5RunConstruct, "sequence.sequenceParts") || [])
      .map(part => part.name)
      .join(", "),
    partsContainedNames: j5RunConstruct.partNames
  }));

const getInputPartsFromInputSequences = j5InputSequences =>
  j5InputSequences
    .map(({ j5InputParts, sequence }) =>
      j5InputParts.map(({ sequencePart }) => ({
        sequencePart: { ...sequencePart, sequence }
      }))
    )
    .reduce((a, b) => a.concat(b), []);

const processJ5AssemblyPieces = j5AssemblyPieces =>
  j5AssemblyPieces.map(ap => ({
    ...ap,
    id: "piece_" + ap.id,
    bps: get(ap, "sequence.sequenceFragments", [])
      .map(f => f.fragment)
      .join("")
  }));

const processInputSequences = j5InputSequences =>
  j5InputSequences.map(s => ({
    ...s,
    sequence: { ...s.sequence, id: "sequence_" + s.sequence.id }
  }));

const processJ5PcrReactions = j5PcrReactions =>
  j5PcrReactions.map(pcr => ({
    ...pcr,
    id: "pcr_" + pcr.id
  }));

class J5ReportRecordView extends Component {
  state = {
    linkDialogName: undefined,
    partCidMap: {}
  };
  showLinkModal = name => {
    this.setState({ linkDialogName: name });
  };
  hideLinkModal = () => {
    this.setState({ linkDialogName: undefined });
  };
  handleLinkTabChange = name => {
    this.setState({ linkDialogName: name });
  };

  processJ5OligoSynthesis(j5Oligos) {
    const { replaceOligoPartCids = true } = this.props;
    return j5Oligos.map(j5Oligo => {
      const partCids = getWrappedInParensMatches(j5Oligo.name);
      const firstTargetPart = get(this.state.partCidMap, `${partCids[0]}.name`);
      const lastTargetPart = get(this.state.partCidMap, `${partCids[1]}.name`);

      let name = j5Oligo.name
        .replace("oli", "Oligo ")
        .replace(/_/g, " ")
        .replace("forward", "Forward")
        .replace("reverse", "Reverse");
      if (replaceOligoPartCids) {
        name = name
          .replace(partCids[0], firstTargetPart)
          .replace(partCids[1], lastTargetPart);
      }
      return {
        ...j5Oligo,
        id: "oligo_" + j5Oligo.id,
        name,
        firstTargetPart,
        lastTargetPart,
        bps: get(j5Oligo, "oligo.sequence.sequenceFragments", [])
          .map(({ fragment }) => {
            return fragment;
          })
          .join("")
      };
    });
  }

  handleExportOligosToCsv = () => {
    const { data } = this.props;
    const j5OligoSyntheses = this.processJ5OligoSynthesis(
      data.j5Report.j5OligoSyntheses
    );
    const csvString = papaparse.unparse([
      ["OligoSynthesis"],
      exportOligosFields.map(field => field.displayName),
      ...j5OligoSyntheses.map(j5Oligo =>
        exportOligosFields.map(field => get(j5Oligo, field.path))
      )
    ]);
    magicDownload(csvString, `Oligo_Synthesis_${data.j5Report.name}.csv`);
  };

  downloadCSV = () => {
    const entitiesForAllTables = this.getEntitiesForAllTables();
    let csvString = "";
    each(schemas, (schema, modelType) => {
      const entities = entitiesForAllTables[modelType];
      const tableCsvString = papaparse.unparse(
        entities.map(row => {
          return schema.fields.reduce((acc, field) => {
            acc[field.displayName || field.path] = get(row, field.path);
            return acc;
          }, {});
        })
      );
      csvString +=
        startCase(modelType).replace("J 5", "j5") +
        "\n" +
        tableCsvString +
        "\n\n";
    });
    magicDownload(csvString, "j5_Report.csv");
  };

  getEntitiesForAllTables = () => {
    const { data } = this.props;
    const {
      j5PcrReactions,
      j5OligoSyntheses,
      j5AssemblyPieces,
      j5RunConstructs,
      j5InputSequences,
      j5DirectSyntheses
      // j5InputParts
    } = data.j5Report;

    const j5InputParts = getInputPartsFromInputSequences(j5InputSequences);
    return {
      prebuiltConstructs: processPrebuiltConstructs(j5RunConstructs),
      j5RunConstructs: processJ5RunConstructs(j5RunConstructs),
      j5InputSequences: processInputSequences(j5InputSequences),
      j5InputParts: processInputParts(j5InputParts),
      j5OligoSyntheses: this.processJ5OligoSynthesis(j5OligoSyntheses),
      j5DirectSyntheses: processJ5DirectSyntheses(j5DirectSyntheses),
      j5PcrReactions: processJ5PcrReactions(j5PcrReactions),
      j5AssemblyPieces: processJ5AssemblyPieces(j5AssemblyPieces)
    };
  };

  renderDownloadButton = () => {
    // option to override export handler
    const { onExportAsCsvClick } = this.props;
    return (
      <Button onClick={onExportAsCsvClick || this.downloadCSV}>
        Export as CSV
      </Button>
    );
  };

  renderDownloadOligoButton = () => {
    // option to override export handler
    const { onExportOligosAsCsvClick } = this.props;
    return (
      <Button
        onClick={onExportOligosAsCsvClick || this.handleExportOligosToCsv}
      >
        Export as CSV
      </Button>
    );
  };

  linkInputSequences = () => {
    this.showLinkModal("inputSequences");
  };
  getAssemblyMethod = () => {
    const { assemblyMethod } = this.props.data.j5Report;
    return startCase(assemblyMethod);
  };

  createPartCidMap(props) {
    const j5InputSequences = get(props, "data.j5Report.j5InputSequences");
    if (!j5InputSequences) return;
    const partCidMap = j5InputSequences.reduce((acc, s) => {
      s.j5InputParts.forEach(p => {
        const sequencePart = p.sequencePart;
        if (sequencePart.cid && !acc[sequencePart.cid]) {
          acc[sequencePart.cid.split("-")[1]] = sequencePart;
        }
      });
      return acc;
    }, {});
    this.setState({
      partCidMap
    });
  }

  componentWillReceiveProps = nextProps => {
    const j5InputSequences = get(nextProps, "data.j5Report.j5InputSequences");
    const oldJ5InputSequences = get(
      this.props,
      "data.j5Report.j5InputSequences"
    );
    if (!(j5InputSequences === oldJ5InputSequences)) {
      this.createPartCidMap(nextProps);
    }
  };

  componentWillMount() {
    this.createPartCidMap(this.props);
  }

  renderHeader = () => {
    const { data, additionalHeaderItems = "", LinkJ5TableDialog } = this.props;

    if (data.loading) return <Loading loading />;

    if (!data.j5Report) {
      return <div>No report found!</div>;
    }

    // JSON.parse(localStorage.getItem('TEMPORARY_j5Run')) || {}
    const { name, assemblyType, dateRan } = data.j5Report;

    return (
      <div className="j5-report-header tg-card">
        {/*{Title}
  <form onSubmit={handleSubmit(onSubmit)} className={'form-layout'}>
    <InputField name="designName" label="Design Name" />
    <InputField name="runDate" label="Run Date" />
    <InputField name="parameterPreset" label="Parameter Preset" />
    <InputField name="assemblyMethod" label="Assembly Method" />
    <InputField name="assemblyType" label="Assembly Type" />
    {Footer}
  </form>*/}
        <FieldWithLabel label="Design Name" field={name} />
        <FieldWithLabel
          label="Assembly Method"
          field={this.getAssemblyMethod()}
        />
        <FieldWithLabel label="Assembly Type" field={assemblyType} />
        <FieldWithLabel
          label="Date Ran"
          field={moment(dateRan).format("lll")}
        />
        {/* tnr: add these in when they are available in lims/hde */}
        {/* <div>
      <span className="j5-report-fieldname">User Name:</span>{" "}
      {assemblyType}
    </div>
    <div>
      <span className="j5-report-fieldname">Design Name:</span>{" "}
      {assemblyType}
    </div>
    <div>
      <span className="j5-report-fieldname">Run Date:</span>{" "}
      {assemblyType}
    </div>
    <div>
      <span className="j5-report-fieldname">Parameter Preset:</span>{" "}
      {assemblyType}
    </div> */}
        <div className="pt-button-group" style={{ marginTop: 10 }}>
          {this.renderDownloadButton()}
          {additionalHeaderItems}
          {LinkJ5TableDialog && (
            <Button onClick={this.linkInputSequences}>
              Link j5 Assembly Report Data to Materials
            </Button>
          )}
        </div>
      </div>
    );
  };

  createSchemaForCombinationOfAssemblyPieces = j5RunConstructs => {
    let maxNumAssemblyPieces = 0;
    j5RunConstructs.forEach(c => {
      const numAssemblyPieces = c.j5ConstructAssemblyPieces.length;
      if (numAssemblyPieces > maxNumAssemblyPieces)
        maxNumAssemblyPieces = numAssemblyPieces;
    });
    const assemblyPieceColumns = times(maxNumAssemblyPieces, i => ({
      path: `j5ConstructAssemblyPieces[${i}].assemblyPiece.id`,
      displayName: `Piece-${i + 1} ID`
    }));
    const partsContainedColumns = times(maxNumAssemblyPieces, i => {
      return {
        path: `j5ConstructAssemblyPieces[${i}].assemblyPiece.j5AssemblyPieceParts`,
        displayName: `Piece-${i + 1} Parts`,
        render: v =>
          v && v.map(p => get(p, "j5InputPart.sequencePart.name")).join(", ")
      };
    });
    const extraColumns = flatten(
      zip(assemblyPieceColumns, partsContainedColumns)
    );
    return {
      fields: [
        {
          path: "id",
          type: "string",
          displayName: "Assembly ID"
        },
        { path: "name", type: "string", displayName: "Construct Name" },
        {
          type: "string",
          displayName: "Assembly Method",
          render: () => this.getAssemblyMethod()
        },
        ...extraColumns
      ]
    };
  };

  render() {
    const {
      data,
      upsertSequence,
      getIsLinkedCellRenderer,
      LinkJ5TableDialog,
      onConstructDoubleClick = noop,
      pcrReactionsTitleElements,
      constructsTitleElements = []
    } = this.props;
    const { linkDialogName } = this.state;

    if (data.loading) return <Loading loading />;

    if (!data.j5Report) {
      return <div>No report found!</div>;
    }

    // JSON.parse(localStorage.getItem('TEMPORARY_j5Run')) || {}

    const entitiesForAllTables = this.getEntitiesForAllTables();
    const linkDialogProps = getLinkDialogProps(data.j5Report);
    const currentLink = linkDialogProps[linkDialogName];
    const linkKeys = Object.keys(linkDialogProps);
    let moveToNextTable;
    let moveToPreviousTable;
    if (linkDialogName) {
      const currIndex = linkKeys.indexOf(linkDialogName);
      const nextKey = linkKeys[currIndex + 1];
      const prevKey = linkKeys[currIndex - 1];
      moveToNextTable =
        nextKey &&
        (() => {
          this.setState({
            linkDialogName: nextKey
          });
        });
      moveToPreviousTable =
        prevKey &&
        (() => {
          this.setState({
            linkDialogName: prevKey
          });
        });
    }
    return (
      <div className={"j5-report-container"}>
        <div style={{ display: "flex-columns" }}>
          {this.renderHeader()}

          {/* tnr: this is just the dialog that needs to be on the page. not actually rendering anything */}
          {LinkJ5TableDialog && (
            <Dialog
              {...(currentLink ? currentLink.dialogProps : {})}
              onClose={this.hideLinkModal}
              isOpen={!!linkDialogName}
            >
              <LinkJ5TableDialog
                {...{
                  ...currentLink,
                  moveToNextTable,
                  moveToPreviousTable,
                  tabs: linkDialogProps,
                  selectedTab: linkDialogName,
                  handleTabChange: this.handleLinkTabChange
                }}
                hideModal={this.hideLinkModal}
              />
            </Dialog>
          )}

          {/*<div className="tg-card">
          <div className="pt-button-group">
            <Button>Show DNA Assembly Parameters</Button>
            <Button>Export as CSV</Button>
            <Button>Export as JSON</Button>
            <Button>Export Constructs</Button>
          </div>
        </div>*/}
          <CollapsibleCard
            icon={
              <InfoHelper>
                Prebuilt constructs are the desired sequences that have already been built and are available in your library.
              </InfoHelper>
            }
            title="Prebuilt Constructs"
            openTitleElements={[
              ...(LinkJ5TableDialog
                ? [
                    <Button
                      key="linkConstructs"
                      onClick={() => {
                        this.showLinkModal("constructs");
                      }}
                    >
                      {" "}
                      Link Constructs
                    </Button>
                  ]
                : []),
              ...constructsTitleElements
            ]}
          >
            <DataTable
              {...sharedTableProps}
              onDoubleClick={onConstructDoubleClick}
              schema={schemas.j5RunConstructs}
              formName="prebuiltConstructs" //because these tables are currently not connected to table params, we need to manually pass a formName here
              entities={entitiesForAllTables.j5RunConstructs}
            />
          </CollapsibleCard>

          <CollapsibleCard
            icon={
              <InfoHelper>
                Constructs are the desired sequences to be built in a j5 run.
              </InfoHelper>
            }
            title="Assembled Constructs"
            openTitleElements={[
              ...(LinkJ5TableDialog
                ? [
                    <Button
                      key="linkConstructs"
                      onClick={() => {
                        this.showLinkModal("constructs");
                      }}
                    >
                      {" "}
                      Link Constructs
                    </Button>
                  ]
                : []),
              ...constructsTitleElements
            ]}
          >
            <DataTable
              {...sharedTableProps}
              onDoubleClick={onConstructDoubleClick}
              schema={schemas.j5RunConstructs}
              formName="j5RunConstructs" //because these tables are currently not connected to table params, we need to manually pass a formName here
              entities={entitiesForAllTables.j5RunConstructs}
            />
          </CollapsibleCard>

          <CollapsibleCard
            title={"Input Sequences"}
            icon={
              <InfoHelper>
                Input Sequences are the sequences that contain the Input Parts
              </InfoHelper>
            }
            openTitleElements={
              LinkJ5TableDialog && (
                <Button
                  onClick={() => {
                    this.showLinkModal("inputSequences");
                  }}
                >
                  {" "}
                  Link Input Sequences
                </Button>
              )
            }
          >
            <DataTable
              {...sharedTableProps}
              schema={schemas.j5InputSequences}
              formName={"j5InputSequences"} //because these tables are currently not connected to table params, we need to manually pass a formName here
              cellRenderer={
                getIsLinkedCellRenderer && 
                getIsLinkedCellRenderer(
                  "sequence.polynucleotideMaterialId",
                  "sequence.hash",
                  "j5InputSequence",
                  upsertSequence
                )
              }
              entities={entitiesForAllTables.j5InputSequences}
            />
          </CollapsibleCard>
          <CollapsibleCard
            title={"Input Parts"}
            icon={
              <InfoHelper>
                Input Parts are the segments of sequence that are being used in
                a j5 run
              </InfoHelper>
            }
          >
            <DataTable
              {...sharedTableProps}
              schema={schemas.j5InputParts}
              formName={"j5InputParts"} //because these tables are currently not connected to table params, we need to manually pass a formName here
              entities={entitiesForAllTables.j5InputParts}
            />
          </CollapsibleCard>
          <CollapsibleCard
            icon={
              <InfoHelper>
                This is the list of oligos that need to be directly synthesized
              </InfoHelper>
            }
            title={"Oligo Synthesis"}
            openTitleElements={
              LinkJ5TableDialog && (
                <Button
                  onClick={() => {
                    this.showLinkModal("oligos");
                  }}
                >
                  {" "}
                  Link Oligos
                </Button>
              )
            }
          >
            <DataTable
              {...sharedTableProps}
              schema={schemas.j5OligoSyntheses}
              formName={"j5OligoSyntheses"} //because these tables are currently not connected to table params, we need to manually pass a formName here
              cellRenderer={
                getIsLinkedCellRenderer &&
                getIsLinkedCellRenderer(
                  "oligo.sequence.polynucleotideMaterialId",
                  "oligo.sequence.hash",
                  "oligo",
                  upsertSequence
                )
              }
              entities={entitiesForAllTables.j5OligoSyntheses}
            />
            <div className="pt-button-group" style={{ marginTop: 10 }}>
              {this.renderDownloadOligoButton()}
            </div>
          </CollapsibleCard>

          <CollapsibleCard
            icon={
              <InfoHelper>
                This is the list DNA pieces that need to be directly synthesized
              </InfoHelper>
            }
            title={"DNA Synthesis"}
            openTitleElements={
              LinkJ5TableDialog && (
                <Button
                  onClick={() => {
                    this.showLinkModal("dnaSynthesis");
                  }}
                >
                  {" "}
                  Link DNA Synthesis Pieces
                </Button>
              )
            }
          >
            <DataTable
              {...sharedTableProps}
              schema={schemas.j5DirectSyntheses}
              formName={"j5DirectSyntheses"} //because these tables are currently not connected to table params, we need to manually pass a formName here
              cellRenderer={
                getIsLinkedCellRenderer &&
                getIsLinkedCellRenderer(
                  "oligo.sequence.polynucleotideMaterialId",
                  "oligo.sequence.hash",
                  "oligo",
                  upsertSequence
                )
              }
              entities={entitiesForAllTables.j5DirectSyntheses}
            />
          </CollapsibleCard>

          <CollapsibleCard
            icon={
              <InfoHelper>
                These are the PCR reactions that need to be run to generate the
                assembly pieces.
              </InfoHelper>
            }
            title={"PCR Reactions"}
            openTitleElements={pcrReactionsTitleElements}
          >
            <DataTable
              {...sharedTableProps}
              schema={schemas.j5PcrReactions}
              formName={"j5PcrReactions"} //because these tables are currently not connected to table params, we need to manually pass a formName here
              entities={entitiesForAllTables.j5PcrReactions}
            />
          </CollapsibleCard>

          <CollapsibleCard
            icon={
              <InfoHelper>
                These are the pieces of DNA that will get put together in a
                final assembly reaction (Gibson/CPEC/SLIC/Golden-Gate) to give
                the desired Constructs
              </InfoHelper>
            }
            title={"DNA Pieces to be Assembled"}
            openTitleElements={
              LinkJ5TableDialog && (
                <Button
                  onClick={() => {
                    this.showLinkModal("dnaPieces");
                  }}
                >
                  {" "}
                  Link DNA Pieces
                </Button>
              )
            }
          >
            <DataTable
              {...sharedTableProps}
              schema={schemas.j5AssemblyPieces}
              formName={"j5AssemblyPieces"} //because these tables are currently not connected to table params, we need to manually pass a formName here
              cellRenderer={
                getIsLinkedCellRenderer &&
                getIsLinkedCellRenderer(
                  "sequence.polynucleotideMaterialId",
                  "sequence.hash",
                  "j5AssemblyPiece",
                  upsertSequence
                )
              }
              entities={entitiesForAllTables.j5AssemblyPieces}
            />
          </CollapsibleCard>

          <CollapsibleCard
            icon={
              <InfoHelper>
                This lists which assembly pieces need to be combined to create
                each construct.
              </InfoHelper>
            }
            title={"Combination of Assembly Pieces"}
          >
            <DataTable
              {...sharedTableProps}
              schema={this.createSchemaForCombinationOfAssemblyPieces(
                entitiesForAllTables.j5RunConstructs
              )}
              formName={"combinationOfAssemblyPieces"} //because these tables are currently not connected to table params, we need to manually pass a formName here
              entities={entitiesForAllTables.j5RunConstructs}
            />
          </CollapsibleCard>

          {/*<div className="tg-card">
          <div style={tableHeaderDivStyle}>
            Assembly Piece Combinations
            displays which assembly pieces to combine together to generate each of the desired combinatorial variants.

            {this.renderCloseTableButton('assemblyPieceCombinations')}
          </div>
          {assemblyPieceCombinationsTableOpen &&
            <DataTable
              withSearch={false}
              isInfinite={true}
              maxHeight={400}
              hidePageSizeWhenPossible
              doNotShowEmptyRows
              isLoading={false}
              urlConnected={false}
            />}
        </div>*/}
        </div>
      </div>
    );
  }
}

// Decorate the form component
export default reduxForm({
  form: "j5Report" // a unique name for this form
})(J5ReportRecordView);

function FieldWithLabel({ label, field }) {
  return (
    <div>
      <span className="j5-report-fieldname">{label}: </span>
      {field}
    </div>
  );
}
