import React, { Component } from "react";
// import EditViewHOC from '../../EditViewHOC'
import { reduxForm } from "redux-form";
import { Button, Dialog } from "@blueprintjs/core";
import { each, get } from "lodash";
import CollapsibleCard from "../CollapsibleCard";
import InfoHelper from "../InfoHelper";
import schemas from "./schemas";
import DataTable from "../DataTable";
import Loading from "../Loading";
import { getRangeLength } from "ve-range-utils";
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

const processInputParts = InputParts =>
  InputParts.map(InputPart => {
    return {
      ...InputPart,
      size: getRangeLength(
        {
          start: InputPart.sequencePart.start,
          end: InputPart.sequencePart.end
        },
        get(InputPart, "sequencePart.sequence.size")
      )
    };
  });

const processJ5RunConstructs = j5RunConstructs =>
  j5RunConstructs.map(j5RunConstruct => ({
    ...j5RunConstruct,
    nextLevelParts: (get(j5RunConstruct, "sequence.sequenceParts") || [])
      .map(part => part.name)
      .join(", "),
    partsContainedNames:
      get(
        j5RunConstruct,
        "j5ConstructAssemblyPieces[0].assemblyPiece.j5AssemblyPieceParts[0].j5InputPart.sequencePart.name"
      ) &&
      j5RunConstruct.j5ConstructAssemblyPieces
        .map(j5ConstructAssemblyPiece =>
          j5ConstructAssemblyPiece.assemblyPiece.j5AssemblyPieceParts.map(
            j5InputPart => j5InputPart.j5InputPart.sequencePart.name
          )
        )
        .join(",")
  }));

const getInputPartsFromInputSequences = j5InputSequences =>
  j5InputSequences
    .map(({ j5InputParts, sequence }) =>
      j5InputParts.map(({ sequencePart }) => ({
        sequencePart: { ...sequencePart, sequence }
      }))
    )
    .reduce((a, b) => a.concat(b), []);

class J5ReportRecordView extends Component {
  state = {
    linkDialogName: undefined
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

  renderInstructions() {
    const {
      data,
      upsertSequence,
      getIsLinkedCellRenderer,
      LinkJ5TableDialog
    } = this.props;
    const { linkDialogName } = this.state;

    if (data.loading) return <Loading loading />;

    if (!data.j5Report) {
      return <div>No report found!</div>;
    }

    // JSON.parse(localStorage.getItem('TEMPORARY_j5Run')) || {}
    const {
      name,
      assemblyMethod,
      assemblyType,

      j5PcrReactions,
      j5OligoSyntheses,
      j5AssemblyPieces,
      j5RunConstructs,
      j5InputSequences
      // j5InputParts
    } = data.j5Report;

    const j5InputParts = getInputPartsFromInputSequences(j5InputSequences);

    const linkDialogProps = {
      inputSequences: {
        dialogProps: {
          title: "Link Input Sequences to Materials"
        },
        items: j5InputSequences,
        sequenceHashes: j5InputSequences.map(({ sequence }) => {
          return sequence.hash;
        })
      },

      oligos: {
        dialogProps: {
          title: "Link Oligos to Materials"
        },
        items: j5OligoSyntheses.map(({ oligo }) => {
          return oligo;
        }),
        sequenceHashes: j5OligoSyntheses.map(({ oligo }) => {
          return oligo.sequence.hash;
        })
      },

      dnaPieces: {
        dialogProps: {
          title: "Link DNA Pieces to Materials"
        },
        items: j5AssemblyPieces,
        sequenceHashes: j5AssemblyPieces.map(({ sequence }) => {
          return sequence.hash;
        })
      }
    };
    each(linkDialogProps, obj => {
      obj.allLinked = true;
      obj.items.some(item => {
        if (item.sequence && !item.sequence.polynucleotideMaterialId) {
          obj.allLinked = false;
          return true;
        }
        return false;
      });
    });
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
      <div style={{ display: "flex-columns" }}>
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
        <div className="tg-card">
          {/*{Title}
          <form onSubmit={handleSubmit(onSubmit)} className={'form-layout'}>
            <InputField name="designName" label="Design Name" />
            <InputField name="runDate" label="Run Date" />
            <InputField name="parameterPreset" label="Parameter Preset" />
            <InputField name="assemblyMethod" label="Assembly Method" />
            <InputField name="assemblyType" label="Assembly Type" />
            {Footer}
          </form>*/}
          <div>
            <span className="j5-report-fieldname">Name:</span> {name}
          </div>
          <div>
            <span className="j5-report-fieldname">Assembly Method:</span>{" "}
            {assemblyMethod}
          </div>
          <div>
            <span className="j5-report-fieldname">Assembly Type:</span>{" "}
            {assemblyType}
          </div>

          {LinkJ5TableDialog && (
            <Button
              onClick={() => {
                this.showLinkModal("inputSequences");
              }}
              style={{ marginTop: 10 }}
            >
              Link Tables to Materials
            </Button>
          )}
        </div>

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
              Constructs are the desired sequences to be built in a j5 run.
            </InfoHelper>
          }
          title={"Constructs"}
        >
          <DataTable
            {...sharedTableProps}
            schema={schemas["j5RunConstructs"]}
            formName={"j5RunConstructs"} //because these tables are currently not connected to table params, we need to manually pass a formName here
            entities={processJ5RunConstructs(j5RunConstructs)}
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
            schema={schemas["j5InputSequences"]}
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
            entities={j5InputSequences}
          />
        </CollapsibleCard>
        <CollapsibleCard
          title={"Input Parts"}
          icon={
            <InfoHelper>
              Input Parts are the segments of sequence that are being used in a
              j5 run
            </InfoHelper>
          }
        >
          <DataTable
            {...sharedTableProps}
            schema={schemas["j5InputParts"]}
            formName={"j5InputParts"} //because these tables are currently not connected to table params, we need to manually pass a formName here
            entities={processInputParts(j5InputParts)}
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
            schema={schemas["j5OligoSyntheses"]}
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
            entities={j5OligoSyntheses}
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
        >
          <DataTable
            {...sharedTableProps}
            schema={schemas["j5PcrReactions"]}
            formName={"j5PcrReactions"} //because these tables are currently not connected to table params, we need to manually pass a formName here
            entities={j5PcrReactions}
          />
        </CollapsibleCard>

        <CollapsibleCard
          icon={
            <InfoHelper>
              These are the pieces of DNA that will get put together in a final
              assembly reaction (Gibson/CPEC/SLIC/Golden-Gate) to give the
              desired Constructs
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
            schema={schemas["j5AssemblyPieces"]}
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
            entities={j5AssemblyPieces}
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
    );
  }

  render() {
    return (
      <div className={"j5-report-container"}>{this.renderInstructions()}</div>
    );
  }
}

// Decorate the form component
export default reduxForm({
  form: "j5Report" // a unique name for this form
})(J5ReportRecordView);
