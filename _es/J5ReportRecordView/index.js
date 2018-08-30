var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
// import EditViewHOC from '../../EditViewHOC'
import { reduxForm } from "redux-form";
import { Button, Dialog, Classes } from "@blueprintjs/core";
import { each, get, startCase, times, zip, flatten, noop } from "lodash";
import moment from "moment";
import schemas from "./schemas";
import Loading from "../Loading";
import { getLinkDialogProps } from "./utils";
import papaparse from "papaparse";
import magicDownload from "../DownloadLink/magicDownload";
import exportOligosFields from "./exportOligosFields";
import J5TableCard from "./J5TableCard";
import processDataForTables from "./processDataForTables";
import "./style.css";

var sharedTableProps = {
  withSearch: false,
  maxHeight: 400,
  showCount: true,
  withDisplayOptions: true,
  doNotShowEmptyRows: true,
  isLoading: false,
  urlConnected: false
};

var J5ReportRecordView = function (_Component) {
  _inherits(J5ReportRecordView, _Component);

  function J5ReportRecordView() {
    var _temp, _this, _ret;

    _classCallCheck(this, J5ReportRecordView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
      linkDialogName: undefined,
      partCidMap: {}
    }, _this.showLinkModal = function (name) {
      _this.setState({ linkDialogName: name });
    }, _this.hideLinkModal = function () {
      _this.setState({ linkDialogName: undefined });
    }, _this.handleLinkTabChange = function (name) {
      _this.setState({ linkDialogName: name });
    }, _this.handleExportOligosToCsv = function () {
      var data = _this.props.data;

      var j5OligoSyntheses = processDataForTables.j5OligoSynthesis(data.j5Report.j5OligoSyntheses);
      var csvString = papaparse.unparse([["OligoSynthesis"], exportOligosFields.map(function (field) {
        return field.displayName;
      })].concat(j5OligoSyntheses.map(function (j5Oligo) {
        return exportOligosFields.map(function (field) {
          return get(j5Oligo, field.path);
        });
      })));
      magicDownload(csvString, "Oligo_Synthesis_" + data.j5Report.name + ".csv");
    }, _this.downloadCSV = function () {
      var entitiesForAllTables = _this.getEntitiesForAllTables();
      var csvString = "";
      each(schemas, function (schema, modelType) {
        var entities = entitiesForAllTables[modelType];
        var tableCsvString = papaparse.unparse(entities.map(function (row) {
          return schema.fields.reduce(function (acc, field) {
            acc[field.displayName || field.path] = get(row, field.path);
            return acc;
          }, {});
        }));
        csvString += startCase(modelType).replace("J 5", "j5") + "\n" + tableCsvString + "\n\n";
      });
      magicDownload(csvString, "j5_Report.csv");
    }, _this.renderDownloadButton = function () {
      // option to override export handler
      var onExportAsCsvClick = _this.props.onExportAsCsvClick;

      return React.createElement(
        Button,
        { onClick: onExportAsCsvClick || _this.downloadCSV },
        "Export as CSV"
      );
    }, _this.renderDownloadOligoButton = function () {
      // option to override export handler
      var onExportOligosAsCsvClick = _this.props.onExportOligosAsCsvClick;

      return React.createElement(
        Button,
        {
          onClick: onExportOligosAsCsvClick || _this.handleExportOligosToCsv
        },
        "Export as CSV"
      );
    }, _this.linkInputSequences = function () {
      _this.showLinkModal("inputSequences");
    }, _this.getAssemblyMethod = function () {
      var assemblyMethod = _this.props.data.j5Report.assemblyMethod;

      return startCase(assemblyMethod);
    }, _this.UNSAFE_componentWillReceiveProps = function (nextProps) {
      var j5InputSequences = get(nextProps, "data.j5Report.j5InputSequences");
      var oldJ5InputSequences = get(_this.props, "data.j5Report.j5InputSequences");
      if (!(j5InputSequences === oldJ5InputSequences)) {
        _this.createPartCidMap(nextProps);
      }
    }, _this.renderHeader = function () {
      var _this$props = _this.props,
          data = _this$props.data,
          _this$props$additiona = _this$props.additionalHeaderItems,
          additionalHeaderItems = _this$props$additiona === undefined ? "" : _this$props$additiona,
          LinkJ5TableDialog = _this$props.LinkJ5TableDialog;


      if (data.loading) return React.createElement(Loading, { loading: true });

      if (!data.j5Report) {
        return React.createElement(
          "div",
          null,
          "No report found!"
        );
      }

      // JSON.parse(localStorage.getItem('TEMPORARY_j5Run')) || {}
      var _data$j5Report = data.j5Report,
          name = _data$j5Report.name,
          assemblyType = _data$j5Report.assemblyType,
          dateRan = _data$j5Report.dateRan;


      return React.createElement(
        "div",
        { className: "j5-report-header tg-card" },
        React.createElement(FieldWithLabel, { label: "Design Name", field: name }),
        React.createElement(FieldWithLabel, {
          label: "Assembly Method",
          field: _this.getAssemblyMethod()
        }),
        React.createElement(FieldWithLabel, { label: "Assembly Type", field: assemblyType }),
        React.createElement(FieldWithLabel, {
          label: "Date Ran",
          field: moment(dateRan).format("lll")
        }),
        React.createElement(
          "div",
          { className: Classes.BUTTON_GROUP, style: { marginTop: 10 } },
          _this.renderDownloadButton(),
          additionalHeaderItems,
          LinkJ5TableDialog && React.createElement(
            Button,
            { onClick: _this.linkInputSequences },
            "Link j5 Assembly Report Data to Materials"
          )
        )
      );
    }, _this.createSchemaForCombinationOfAssemblyPieces = function (j5RunConstructs) {
      var maxNumAssemblyPieces = 0;
      j5RunConstructs.forEach(function (c) {
        var numAssemblyPieces = c.j5ConstructAssemblyPieces.length;
        if (numAssemblyPieces > maxNumAssemblyPieces) maxNumAssemblyPieces = numAssemblyPieces;
      });
      var assemblyPieceColumns = times(maxNumAssemblyPieces, function (i) {
        return {
          path: "j5ConstructAssemblyPieces[" + i + "].assemblyPiece.id",
          displayName: "Piece-" + (i + 1) + " ID"
        };
      });
      var partsContainedColumns = times(maxNumAssemblyPieces, function (i) {
        return {
          path: "j5ConstructAssemblyPieces[" + i + "].assemblyPiece.j5AssemblyPieceParts",
          displayName: "Piece-" + (i + 1) + " Parts",
          render: function render(v) {
            return v && v.map(function (p) {
              return get(p, "j5InputPart.sequencePart.name");
            }).join(", ");
          }
        };
      });
      var extraColumns = flatten(zip(assemblyPieceColumns, partsContainedColumns));
      return {
        fields: [{
          path: "id",
          type: "string",
          displayName: "Assembly ID"
        }, { path: "name", type: "string", displayName: "Construct Name" }, {
          type: "string",
          displayName: "Assembly Method",
          render: function render() {
            return _this.getAssemblyMethod();
          }
        }].concat(extraColumns)
      };
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  // getEntitiesForAllTables = () => {
  //   const { data } = this.props;
  //   const {
  //     j5PcrReactions,
  //     j5OligoSyntheses,
  //     j5AssemblyPieces,
  //     j5RunConstructs,
  //     j5InputSequences,
  //     j5DirectSyntheses
  //     // j5InputParts
  //   } = data.j5Report;

  //   const j5InputParts =
  //     j5InputSequences && getInputPartsFromInputSequences(j5InputSequences);
  //   return {
  //     prebuiltConstructs:
  //       j5RunConstructs && processPrebuiltConstructs(j5RunConstructs),
  //     j5RunConstructs:
  //       j5RunConstructs && processJ5RunConstructs(j5RunConstructs),
  //     j5InputSequences:
  //       j5InputSequences && processInputSequences(j5InputSequences),
  //     j5InputParts: j5InputParts && processInputParts(j5InputParts),
  //     j5OligoSyntheses:
  //       j5OligoSyntheses && this.processJ5OligoSynthesis(j5OligoSyntheses),
  //     j5DirectSyntheses:
  //       j5DirectSyntheses && processJ5DirectSyntheses(j5DirectSyntheses),
  //     j5PcrReactions: j5PcrReactions && processJ5PcrReactions(j5PcrReactions),
  //     j5AssemblyPieces:
  //       j5AssemblyPieces && processJ5AssemblyPieces(j5AssemblyPieces)
  //   };
  // };

  J5ReportRecordView.prototype.createPartCidMap = function createPartCidMap(props) {
    var j5InputSequences = get(props, "data.j5Report.j5InputSequences");
    if (!j5InputSequences) return;
    var partCidMap = j5InputSequences.reduce(function (acc, s) {
      s.j5InputParts.forEach(function (p) {
        var sequencePart = p.sequencePart;
        if (sequencePart.cid && !acc[sequencePart.cid]) {
          acc[sequencePart.cid.split("-")[1]] = sequencePart;
        }
      });
      return acc;
    }, {});
    this.setState({
      partCidMap: partCidMap
    });
  };

  J5ReportRecordView.prototype.UNSAFE_componentWillMount = function UNSAFE_componentWillMount() {
    this.createPartCidMap(this.props);
  };

  /**
   * Given the model (pluralized) get the schema corresponding to the model. This
   * will either be the default schema or the one returned by the prop `getSchema`
   * if that prop is passed. The prop will be called with the model as the first argument and
   * the default schema as its second argument. The prop should not mutate the schema.
   * @param {string} model Should be pluralized.
   */
  J5ReportRecordView.prototype.getSchema = function getSchema(model) {
    if (model === "combinationOfAssemblyPieces") {
      throw new Error("Due pecularities in the code, we cannot override the schema for combinationOfAssemblyPieces");
    }

    var defaultSchema = schemas[model];
    var passedGetSchema = this.props.getSchema;

    if (passedGetSchema) {
      return passedGetSchema(model, defaultSchema);
    } else {
      return defaultSchema;
    }
  };

  J5ReportRecordView.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        data = _props.data,
        getIsLinkedCellRenderer = _props.getIsLinkedCellRenderer,
        LinkJ5TableDialog = _props.LinkJ5TableDialog,
        _props$onConstructDou = _props.onConstructDoubleClick,
        onConstructDoubleClick = _props$onConstructDou === undefined ? noop : _props$onConstructDou,
        pcrReactionsTitleElements = _props.pcrReactionsTitleElements,
        _props$constructsTitl = _props.constructsTitleElements,
        constructsTitleElements = _props$constructsTitl === undefined ? [] : _props$constructsTitl,
        _props$oligosTitleEle = _props.oligosTitleElements,
        oligosTitleElements = _props$oligosTitleEle === undefined ? [] : _props$oligosTitleEle,
        _props$linkDialogWidt = _props.linkDialogWidth,
        linkDialogWidth = _props$linkDialogWidt === undefined ? 500 : _props$linkDialogWidt,
        _props$fragmentMap = _props.fragmentMap,
        fragmentMap = _props$fragmentMap === undefined ? {} : _props$fragmentMap,
        _props$noPrebuiltCons = _props.noPrebuiltConstructs,
        noPrebuiltConstructs = _props$noPrebuiltCons === undefined ? false : _props$noPrebuiltCons;
    var linkDialogName = this.state.linkDialogName;


    if (data.loading) return React.createElement(Loading, { loading: true });

    if (!data.j5Report) {
      return React.createElement(
        "div",
        null,
        "No report found!"
      );
    }
    var j5Report = data.j5Report;
    var linkDialogProps = getLinkDialogProps(data.j5Report, fragmentMap);
    var currentLink = linkDialogProps[linkDialogName];
    var linkKeys = Object.keys(linkDialogProps);
    var moveToNextTable = void 0;
    var moveToPreviousTable = void 0;
    if (linkDialogName) {
      var currIndex = linkKeys.indexOf(linkDialogName);
      var nextKey = linkKeys[currIndex + 1];
      var prevKey = linkKeys[currIndex - 1];
      moveToNextTable = nextKey && function () {
        _this2.setState({
          linkDialogName: nextKey
        });
      };
      moveToPreviousTable = prevKey && function () {
        _this2.setState({
          linkDialogName: prevKey
        });
      };
    }
    return React.createElement(
      "div",
      { className: "j5-report-container" },
      React.createElement(
        "div",
        { style: { display: "flex-columns" } },
        this.renderHeader(),
        LinkJ5TableDialog && React.createElement(
          Dialog,
          _extends({
            style: {
              width: linkDialogWidth
            }
          }, currentLink ? currentLink.dialogProps : {}, {
            onClose: this.hideLinkModal,
            isOpen: !!linkDialogName
          }),
          React.createElement(LinkJ5TableDialog, _extends({}, _extends({}, currentLink, {
            moveToNextTable: moveToNextTable,
            moveToPreviousTable: moveToPreviousTable,
            tabs: linkDialogProps,
            selectedTab: linkDialogName,
            handleTabChange: this.handleLinkTabChange
          }), {
            hideModal: this.hideLinkModal
          }))
        ),
        !noPrebuiltConstructs && React.createElement(J5TableCard, {
          j5ReportId: j5Report.id,
          helperMessage: "Prebuilt constructs are the desired sequences that have already been built and are available in your library.",
          title: "Prebuilt Constructs",
          processData: processDataForTables.prebuiltConstruct,
          entities: j5Report.j5RunConstructs[0].isPrebuilt !== null ? j5Report.j5RunConstructs : [],
          fragment: fragmentMap.j5RunConstruct,
          showLinkModal: function showLinkModal() {
            return _this2.showLinkModal("constructs");
          },
          isLinkable: LinkJ5TableDialog,
          onDoubleClick: onConstructDoubleClick,
          schema: this.getSchema("j5RunConstructs"),
          tableProps: sharedTableProps
        }),
        React.createElement(J5TableCard, {
          j5ReportId: j5Report.id,
          helperMessage: "Constructs are the desired sequences to be built in a j5 run.",
          title: "Assembled Constructs",
          processData: processDataForTables.j5RunConstruct,
          entities: j5Report.j5RunConstructs[0].isPrebuilt !== null ? [] : j5Report.j5RunConstructs,
          fragment: fragmentMap.j5RunConstruct,
          showLinkModal: function showLinkModal() {
            return _this2.showLinkModal("constructs");
          },
          isLinkable: LinkJ5TableDialog,
          onDoubleClick: onConstructDoubleClick,
          tableProps: sharedTableProps,
          schema: this.getSchema("j5RunConstructs"),
          openTitleElements: constructsTitleElements
        }),
        React.createElement(J5TableCard, {
          j5ReportId: j5Report.id,
          helperMessage: "Input Sequences are the sequences that contain the Input Parts.",
          title: "Input Sequences",
          processData: processDataForTables.j5InputSequence,
          entities: j5Report.j5InputSequences,
          fragment: fragmentMap.j5InputSequence,
          showLinkModal: function showLinkModal() {
            return _this2.showLinkModal("inputSequences");
          },
          isLinkable: LinkJ5TableDialog,
          tableProps: sharedTableProps,
          cellRenderer: getIsLinkedCellRenderer && getIsLinkedCellRenderer("sequence.polynucleotideMaterialId", "sequence.hash", "j5InputSequence"),
          schema: this.getSchema("j5InputSequences")
        }),
        React.createElement(J5TableCard, {
          j5ReportId: j5Report.id,
          helperMessage: "Input Parts are the segments of sequence that are being used in a j5 run.",
          title: "Input Parts",
          processData: processDataForTables.j5InputPart,
          entities: j5Report.j5InputSequences,
          fragment: fragmentMap.j5InputSequence,
          tableProps: sharedTableProps,
          schema: this.getSchema("j5InputParts")
        }),
        React.createElement(
          J5TableCard,
          {
            j5ReportId: j5Report.id,
            helperMessage: "This is the list of oligos that need to be directly synthesized.",
            title: "Oligo Synthesis",
            processData: processDataForTables.j5OligoSynthesis,
            entities: j5Report.j5OligoSyntheses,
            fragment: fragmentMap.j5OligoSynthesis,
            tableProps: sharedTableProps,
            isLinkable: LinkJ5TableDialog,
            schema: this.getSchema("j5OligoSyntheses"),
            showLinkModal: function showLinkModal() {
              return _this2.showLinkModal("oligos");
            },
            linkButtonText: "Link Oligos",
            openTitleElements: oligosTitleElements,
            cellRenderer: getIsLinkedCellRenderer && getIsLinkedCellRenderer("oligo.sequence.polynucleotideMaterialId", "oligo.sequence.hash", "oligo")
          },
          React.createElement(
            "div",
            { className: Classes.BUTTON_GROUP, style: { marginTop: 10 } },
            this.renderDownloadOligoButton()
          )
        ),
        React.createElement(J5TableCard, {
          j5ReportId: j5Report.id,
          helperMessage: "This is the list DNA pieces that need to be directly synthesized.",
          title: "DNA Synthesis",
          processData: processDataForTables.j5DirectSynthesis,
          entities: j5Report.j5DirectSyntheses,
          tableProps: sharedTableProps,
          schema: this.getSchema("j5DirectSyntheses"),
          fragment: fragmentMap.j5DirectSynthesis,
          isLinkable: LinkJ5TableDialog,
          showLinkModal: function showLinkModal() {
            return _this2.showLinkModal("dnaSynthesisSequences");
          },
          linkButtonText: "Link DNA Synthesis Pieces",
          cellRenderer: getIsLinkedCellRenderer && getIsLinkedCellRenderer("oligo.sequence.polynucleotideMaterialId", "oligo.sequence.hash", "oligo")
        }),
        React.createElement(J5TableCard, {
          j5ReportId: j5Report.id,
          helperMessage: "These are the PCR reactions that need to be run to generate the assembly pieces.",
          title: "PCR Reactions",
          processData: processDataForTables.j5PcrReaction,
          entities: j5Report.j5PcrReactions,
          tableProps: sharedTableProps,
          openTitleElements: pcrReactionsTitleElements,
          fragment: fragmentMap.j5PcrReaction,
          schema: this.getSchema("j5PcrReactions")
        }),
        React.createElement(J5TableCard, {
          j5ReportId: j5Report.id,
          helperMessage: "These are the pieces of DNA that will get put together in a final assembly reaction (Gibson/CPEC/SLIC/Golden-Gate) to give the desired Constructs.",
          title: "DNA Pieces to be Assembled",
          processData: processDataForTables.j5AssemblyPiece,
          entities: j5Report.j5AssemblyPieces,
          fragment: fragmentMap.j5AssemblyPiece,
          isLinkable: LinkJ5TableDialog,
          showLinkModal: function showLinkModal() {
            return _this2.showLinkModal("dnaPieces");
          },
          linkButtonText: "Link DNA Pieces",
          tableProps: sharedTableProps,
          schema: this.getSchema("j5AssemblyPieces"),
          cellRenderer: getIsLinkedCellRenderer && getIsLinkedCellRenderer("sequence.polynucleotideMaterialId", "sequence.hash", "j5AssemblyPiece")
        }),
        React.createElement(J5TableCard, {
          j5ReportId: j5Report.id,
          helperMessage: "This lists which assembly pieces need to be combined to create each construct.",
          title: "Combination of Assembly Pieces",
          processData: processDataForTables.j5RunConstruct,
          entities: j5Report.j5RunConstructs[0].isPrebuilt !== null ? [] : j5Report.j5RunConstructs,
          fragment: fragmentMap.j5RunConstruct,
          tableProps: sharedTableProps,
          createSchema: this.createSchemaForCombinationOfAssemblyPieces
        })
      )
    );
  };

  return J5ReportRecordView;
}(Component);

// Decorate the form component


export default reduxForm({
  form: "j5Report" // a unique name for this form
})(J5ReportRecordView);

function FieldWithLabel(_ref) {
  var label = _ref.label,
      field = _ref.field;

  return React.createElement(
    "div",
    null,
    React.createElement(
      "span",
      { className: "j5-report-fieldname" },
      label,
      ": "
    ),
    field
  );
}