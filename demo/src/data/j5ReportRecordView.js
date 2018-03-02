export default {
  loading: false,
  j5Report:  {
    "id": "2",
    "name": "cgg",
    "assemblyMethod": "CombinatorialGoldenGate",
    "assemblyType": "circular",
    "createdAt": "2018-03-01T22:21:20.432Z",
    "updatedAt": "2018-03-01T22:21:20.432Z",
    "j5FileId": "1",
    "j5RunConstructs": [
      {
        "id": "9",
        "name": "Construct 7",
        "sequence": {
          "id": "52",
          "name": "Construct 7",
          "circular": true,
          "description": "pS8c-vector_backbone,ccmN_nterm_sig_pep,short_gly_ser_linker,GFPuv,ssrA_tag_5prime,ssrA_tag_3prime",
          "size": 5347,
          "hash": "02fdf578f97eb4406c7b7f5909f227393c275d8a27c68d03d4bfc99686010c0b",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [
            {
              "id": "27",
              "cid": "NLP1-undefined-5734",
              "name": "short_gly_ser_linker",
              "__typename": "sequencePart"
            }
          ],
          "sequenceSegments": [
            {
              "id": "85",
              "start": 2064,
              "end": 1238,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "86",
              "start": 1239,
              "end": 1295,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "87",
              "start": 1296,
              "end": 1319,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "88",
              "start": 1320,
              "end": 2030,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "89",
              "start": 2031,
              "end": 2045,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "90",
              "start": 2046,
              "end": 2063,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [
            {
              "id": "235",
              "start": 6,
              "end": 885,
              "type": "CDS",
              "name": "araC",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "236",
              "start": 913,
              "end": 931,
              "type": "protein_bind",
              "name": "operator O2",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "237",
              "start": 1035,
              "end": 1064,
              "type": "promoter",
              "name": "araC promoter",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "238",
              "start": 1071,
              "end": 1093,
              "type": "protein_bind",
              "name": "operator O1",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "239",
              "start": 1114,
              "end": 1128,
              "type": "misc_binding",
              "name": "CAP site",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "240",
              "start": 1123,
              "end": 1162,
              "type": "protein_bind",
              "name": "Operator I2 and I1",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "241",
              "start": 1160,
              "end": 1188,
              "type": "promoter",
              "name": "pBAD promoter",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "242",
              "start": 1206,
              "end": 1299,
              "type": "primer_bind",
              "name": "Oligo 2 (pS8c-vector_backbone) (ccmN_nterm_sig_pep) Reverse",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "243",
              "start": 1215,
              "end": 1235,
              "type": "RBS",
              "name": "RBS",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "244",
              "start": 1235,
              "end": 2066,
              "type": "CDS",
              "name": "GFPuv",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "245",
              "start": 1238,
              "end": 1295,
              "type": "misc_feature",
              "name": "ccmN_sig_pep",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "246",
              "start": 1295,
              "end": 1319,
              "type": "misc_feature",
              "name": "gly_ser_linker",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "247",
              "start": 1295,
              "end": 1351,
              "type": "primer_bind",
              "name": "Oligo 3 (short_gly_ser_linker) (GFPuv) Forward",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "248",
              "start": 1738,
              "end": 1739,
              "type": "misc_feature",
              "name": "XhoI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "249",
              "start": 1837,
              "end": 1838,
              "type": "misc_feature",
              "name": "BamHI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "250",
              "start": 2012,
              "end": 2049,
              "type": "primer_bind",
              "name": "Oligo 4 (GFPuv) (ssrA_tag_5prime) Reverse",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "251",
              "start": 2030,
              "end": 2063,
              "type": "misc_feature",
              "name": "ssrA tag",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "252",
              "start": 2045,
              "end": 2088,
              "type": "primer_bind",
              "name": "Oligo 1 (ssrA_tag_3prime) (pS8c-vector_backbone) Forward",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "253",
              "start": 2081,
              "end": 2210,
              "type": "terminator",
              "name": "dbl term",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "254",
              "start": 2211,
              "end": 4440,
              "type": "rep_origin",
              "name": "pSC101**",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "255",
              "start": 4440,
              "end": 4546,
              "type": "terminator",
              "name": "T0",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "256",
              "start": 4561,
              "end": 5221,
              "type": "misc_marker",
              "name": "CmR",
              "strand": -1,
              "__typename": "sequenceFeature"
            }
          ],
          "__typename": "sequence"
        },
        "j5ConstructAssemblyPieces": [
          {
            "id": "17",
            "index": 0,
            "assemblyPiece": {
              "id": "12",
              "name": "AP1-5",
              "type": "PCR",
              "j5AssemblyPieceParts": [
                {
                  "id": "34",
                  "j5InputPart": {
                    "id": "14",
                    "sequencePart": {
                      "id": "26",
                      "name": "ssrA_tag_3prime",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "35",
                  "j5InputPart": {
                    "id": "11",
                    "sequencePart": {
                      "id": "19",
                      "name": "pS8c-vector_backbone",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "36",
                  "j5InputPart": {
                    "id": "17",
                    "sequencePart": {
                      "id": "24",
                      "name": "ccmN_nterm_sig_pep",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                }
              ],
              "sequence": {
                "id": "51",
                "name": "PCR1-5",
                "circular": null,
                "description": null,
                "size": 4629,
                "hash": "16b8dde7975374a940f75356a00802d81cac1827f20d3ac8393117c556533576",
                "polynucleotideMaterialId": null,
                "isJ5Sequence": true,
                "sequenceParts": [],
                "sequenceSegments": [
                  {
                    "id": "84",
                    "start": 0,
                    "end": 4628,
                    "strand": 1,
                    "sourceSequencePart": null,
                    "__typename": "sequenceSegment"
                  }
                ],
                "sequenceFeatures": [],
                "__typename": "sequence"
              },
              "__typename": "j5AssemblyPiece"
            },
            "__typename": "j5ConstructAssemblyPiece"
          },
          {
            "id": "18",
            "index": 1,
            "assemblyPiece": {
              "id": "10",
              "name": "AP1-3",
              "type": "PCR",
              "j5AssemblyPieceParts": [
                {
                  "id": "28",
                  "j5InputPart": {
                    "id": "18",
                    "sequencePart": {
                      "id": "23",
                      "name": "short_gly_ser_linker",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "29",
                  "j5InputPart": {
                    "id": "10",
                    "sequencePart": {
                      "id": "18",
                      "name": "GFPuv",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "30",
                  "j5InputPart": {
                    "id": "13",
                    "sequencePart": {
                      "id": "25",
                      "name": "ssrA_tag_5prime",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                }
              ],
              "sequence": {
                "id": "49",
                "name": "PCR1-3",
                "circular": null,
                "description": null,
                "size": 782,
                "hash": "1ddba4f3e50211e8f9d188267434c37fb4222d45d2ab85ae58b1c849b92baf2b",
                "polynucleotideMaterialId": null,
                "isJ5Sequence": true,
                "sequenceParts": [],
                "sequenceSegments": [
                  {
                    "id": "82",
                    "start": 0,
                    "end": 781,
                    "strand": 1,
                    "sourceSequencePart": null,
                    "__typename": "sequenceSegment"
                  }
                ],
                "sequenceFeatures": [],
                "__typename": "sequence"
              },
              "__typename": "j5AssemblyPiece"
            },
            "__typename": "j5ConstructAssemblyPiece"
          }
        ],
        "__typename": "j5RunConstruct"
      },
      {
        "id": "10",
        "name": "Construct 3",
        "sequence": {
          "id": "53",
          "name": "Construct 3",
          "circular": true,
          "description": "pS8c-vector_backbone,BMC_nterm_sig_pep,short_gly_ser_linker,GFPuv,ssrA_tag_5prime,ssrA_tag_3prime",
          "size": 5341,
          "hash": "bef18dcb5ac9e20328cf58c0c439b1a02d93183e008f71939ac3f6ec3e5c5293",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [
            {
              "id": "28",
              "cid": "NLP1-undefined-5730",
              "name": "short_gly_ser_linker",
              "__typename": "sequencePart"
            }
          ],
          "sequenceSegments": [
            {
              "id": "91",
              "start": 2058,
              "end": 1238,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "92",
              "start": 1239,
              "end": 1289,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "93",
              "start": 1290,
              "end": 1313,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "94",
              "start": 1314,
              "end": 2024,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "95",
              "start": 2025,
              "end": 2039,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "96",
              "start": 2040,
              "end": 2057,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [
            {
              "id": "257",
              "start": 6,
              "end": 885,
              "type": "CDS",
              "name": "araC",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "258",
              "start": 913,
              "end": 931,
              "type": "protein_bind",
              "name": "operator O2",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "259",
              "start": 1035,
              "end": 1064,
              "type": "promoter",
              "name": "araC promoter",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "260",
              "start": 1071,
              "end": 1093,
              "type": "protein_bind",
              "name": "operator O1",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "261",
              "start": 1114,
              "end": 1128,
              "type": "misc_binding",
              "name": "CAP site",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "262",
              "start": 1123,
              "end": 1162,
              "type": "protein_bind",
              "name": "Operator I2 and I1",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "263",
              "start": 1160,
              "end": 1188,
              "type": "promoter",
              "name": "pBAD promoter",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "264",
              "start": 1206,
              "end": 1293,
              "type": "primer_bind",
              "name": "Oligo 2 (pS8c-vector_backbone) (BMC_nterm_sig_pep) Reverse",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "265",
              "start": 1215,
              "end": 1235,
              "type": "RBS",
              "name": "RBS",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "266",
              "start": 1235,
              "end": 2060,
              "type": "CDS",
              "name": "GFPuv",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "267",
              "start": 1238,
              "end": 1289,
              "type": "misc_feature",
              "name": "Clostridium_BMC_sig_pep",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "268",
              "start": 1289,
              "end": 1313,
              "type": "misc_feature",
              "name": "gly_ser_linker",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "269",
              "start": 1289,
              "end": 1345,
              "type": "primer_bind",
              "name": "Oligo 3 (short_gly_ser_linker) (GFPuv) Forward",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "270",
              "start": 1732,
              "end": 1733,
              "type": "misc_feature",
              "name": "XhoI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "271",
              "start": 1831,
              "end": 1832,
              "type": "misc_feature",
              "name": "BamHI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "272",
              "start": 2006,
              "end": 2043,
              "type": "primer_bind",
              "name": "Oligo 4 (GFPuv) (ssrA_tag_5prime) Reverse",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "273",
              "start": 2024,
              "end": 2057,
              "type": "misc_feature",
              "name": "ssrA tag",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "274",
              "start": 2039,
              "end": 2082,
              "type": "primer_bind",
              "name": "Oligo 1 (ssrA_tag_3prime) (pS8c-vector_backbone) Forward",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "275",
              "start": 2075,
              "end": 2204,
              "type": "terminator",
              "name": "dbl term",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "276",
              "start": 2205,
              "end": 4434,
              "type": "rep_origin",
              "name": "pSC101**",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "277",
              "start": 4434,
              "end": 4540,
              "type": "terminator",
              "name": "T0",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "278",
              "start": 4555,
              "end": 5215,
              "type": "misc_marker",
              "name": "CmR",
              "strand": -1,
              "__typename": "sequenceFeature"
            }
          ],
          "__typename": "sequence"
        },
        "j5ConstructAssemblyPieces": [
          {
            "id": "19",
            "index": 0,
            "assemblyPiece": {
              "id": "7",
              "name": "AP1-0",
              "type": "PCR",
              "j5AssemblyPieceParts": [
                {
                  "id": "19",
                  "j5InputPart": {
                    "id": "14",
                    "sequencePart": {
                      "id": "26",
                      "name": "ssrA_tag_3prime",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "20",
                  "j5InputPart": {
                    "id": "11",
                    "sequencePart": {
                      "id": "19",
                      "name": "pS8c-vector_backbone",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "21",
                  "j5InputPart": {
                    "id": "15",
                    "sequencePart": {
                      "id": "21",
                      "name": "BMC_nterm_sig_pep",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                }
              ],
              "sequence": {
                "id": "46",
                "name": "PCR1-0",
                "circular": null,
                "description": null,
                "size": 4623,
                "hash": "fb9911fb5b38343d5765987778fb819cb8c112d32a283468e15eafa5ab6f7673",
                "polynucleotideMaterialId": null,
                "isJ5Sequence": true,
                "sequenceParts": [],
                "sequenceSegments": [
                  {
                    "id": "79",
                    "start": 0,
                    "end": 4622,
                    "strand": 1,
                    "sourceSequencePart": null,
                    "__typename": "sequenceSegment"
                  }
                ],
                "sequenceFeatures": [],
                "__typename": "sequence"
              },
              "__typename": "j5AssemblyPiece"
            },
            "__typename": "j5ConstructAssemblyPiece"
          },
          {
            "id": "20",
            "index": 1,
            "assemblyPiece": {
              "id": "10",
              "name": "AP1-3",
              "type": "PCR",
              "j5AssemblyPieceParts": [
                {
                  "id": "28",
                  "j5InputPart": {
                    "id": "18",
                    "sequencePart": {
                      "id": "23",
                      "name": "short_gly_ser_linker",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "29",
                  "j5InputPart": {
                    "id": "10",
                    "sequencePart": {
                      "id": "18",
                      "name": "GFPuv",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "30",
                  "j5InputPart": {
                    "id": "13",
                    "sequencePart": {
                      "id": "25",
                      "name": "ssrA_tag_5prime",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                }
              ],
              "sequence": {
                "id": "49",
                "name": "PCR1-3",
                "circular": null,
                "description": null,
                "size": 782,
                "hash": "1ddba4f3e50211e8f9d188267434c37fb4222d45d2ab85ae58b1c849b92baf2b",
                "polynucleotideMaterialId": null,
                "isJ5Sequence": true,
                "sequenceParts": [],
                "sequenceSegments": [
                  {
                    "id": "82",
                    "start": 0,
                    "end": 781,
                    "strand": 1,
                    "sourceSequencePart": null,
                    "__typename": "sequenceSegment"
                  }
                ],
                "sequenceFeatures": [],
                "__typename": "sequence"
              },
              "__typename": "j5AssemblyPiece"
            },
            "__typename": "j5ConstructAssemblyPiece"
          }
        ],
        "__typename": "j5RunConstruct"
      },
      {
        "id": "11",
        "name": "Construct 5",
        "sequence": {
          "id": "54",
          "name": "Construct 5",
          "circular": true,
          "description": "pS8c-vector_backbone,ccmN_nterm_sig_pep,long_gly_ser_linker,GFPuv,ssrA_tag_5prime,ssrA_tag_3prime",
          "size": 5371,
          "hash": "d48e5fcc053382df40c4d39028180db30d354946a1eb53ad1cf6046c89b97783",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [
            {
              "id": "29",
              "cid": "NLP1-undefined-5731",
              "name": "short_gly_ser_linker",
              "__typename": "sequencePart"
            }
          ],
          "sequenceSegments": [
            {
              "id": "97",
              "start": 2088,
              "end": 1238,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "98",
              "start": 1239,
              "end": 1295,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "99",
              "start": 1296,
              "end": 1343,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "100",
              "start": 1344,
              "end": 2054,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "101",
              "start": 2055,
              "end": 2069,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "102",
              "start": 2070,
              "end": 2087,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [
            {
              "id": "279",
              "start": 6,
              "end": 885,
              "type": "CDS",
              "name": "araC",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "280",
              "start": 913,
              "end": 931,
              "type": "protein_bind",
              "name": "operator O2",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "281",
              "start": 1035,
              "end": 1064,
              "type": "promoter",
              "name": "araC promoter",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "282",
              "start": 1071,
              "end": 1093,
              "type": "protein_bind",
              "name": "operator O1",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "283",
              "start": 1114,
              "end": 1128,
              "type": "misc_binding",
              "name": "CAP site",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "284",
              "start": 1123,
              "end": 1162,
              "type": "protein_bind",
              "name": "Operator I2 and I1",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "285",
              "start": 1160,
              "end": 1188,
              "type": "promoter",
              "name": "pBAD promoter",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "286",
              "start": 1206,
              "end": 1299,
              "type": "primer_bind",
              "name": "Oligo 2 (pS8c-vector_backbone) (ccmN_nterm_sig_pep) Reverse",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "287",
              "start": 1215,
              "end": 1235,
              "type": "RBS",
              "name": "RBS",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "288",
              "start": 1235,
              "end": 2090,
              "type": "CDS",
              "name": "GFPuv",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "289",
              "start": 1238,
              "end": 1295,
              "type": "misc_feature",
              "name": "ccmN_sig_pep",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "290",
              "start": 1295,
              "end": 1343,
              "type": "misc_feature",
              "name": "gly_ser_linker",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "291",
              "start": 1295,
              "end": 1375,
              "type": "primer_bind",
              "name": "Oligo 3 (long_gly_ser_linker) (GFPuv) Forward",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "292",
              "start": 1762,
              "end": 1763,
              "type": "misc_feature",
              "name": "XhoI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "293",
              "start": 1861,
              "end": 1862,
              "type": "misc_feature",
              "name": "BamHI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "294",
              "start": 2036,
              "end": 2073,
              "type": "primer_bind",
              "name": "Oligo 4 (GFPuv) (ssrA_tag_5prime) Reverse",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "295",
              "start": 2054,
              "end": 2087,
              "type": "misc_feature",
              "name": "ssrA tag",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "296",
              "start": 2069,
              "end": 2112,
              "type": "primer_bind",
              "name": "Oligo 1 (ssrA_tag_3prime) (pS8c-vector_backbone) Forward",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "297",
              "start": 2105,
              "end": 2234,
              "type": "terminator",
              "name": "dbl term",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "298",
              "start": 2235,
              "end": 4464,
              "type": "rep_origin",
              "name": "pSC101**",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "299",
              "start": 4464,
              "end": 4570,
              "type": "terminator",
              "name": "T0",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "300",
              "start": 4585,
              "end": 5245,
              "type": "misc_marker",
              "name": "CmR",
              "strand": -1,
              "__typename": "sequenceFeature"
            }
          ],
          "__typename": "sequence"
        },
        "j5ConstructAssemblyPieces": [
          {
            "id": "21",
            "index": 0,
            "assemblyPiece": {
              "id": "12",
              "name": "AP1-5",
              "type": "PCR",
              "j5AssemblyPieceParts": [
                {
                  "id": "34",
                  "j5InputPart": {
                    "id": "14",
                    "sequencePart": {
                      "id": "26",
                      "name": "ssrA_tag_3prime",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "35",
                  "j5InputPart": {
                    "id": "11",
                    "sequencePart": {
                      "id": "19",
                      "name": "pS8c-vector_backbone",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "36",
                  "j5InputPart": {
                    "id": "17",
                    "sequencePart": {
                      "id": "24",
                      "name": "ccmN_nterm_sig_pep",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                }
              ],
              "sequence": {
                "id": "51",
                "name": "PCR1-5",
                "circular": null,
                "description": null,
                "size": 4629,
                "hash": "16b8dde7975374a940f75356a00802d81cac1827f20d3ac8393117c556533576",
                "polynucleotideMaterialId": null,
                "isJ5Sequence": true,
                "sequenceParts": [],
                "sequenceSegments": [
                  {
                    "id": "84",
                    "start": 0,
                    "end": 4628,
                    "strand": 1,
                    "sourceSequencePart": null,
                    "__typename": "sequenceSegment"
                  }
                ],
                "sequenceFeatures": [],
                "__typename": "sequence"
              },
              "__typename": "j5AssemblyPiece"
            },
            "__typename": "j5ConstructAssemblyPiece"
          },
          {
            "id": "22",
            "index": 1,
            "assemblyPiece": {
              "id": "8",
              "name": "AP1-1",
              "type": "PCR",
              "j5AssemblyPieceParts": [
                {
                  "id": "22",
                  "j5InputPart": {
                    "id": "16",
                    "sequencePart": {
                      "id": "22",
                      "name": "long_gly_ser_linker",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "23",
                  "j5InputPart": {
                    "id": "10",
                    "sequencePart": {
                      "id": "18",
                      "name": "GFPuv",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "24",
                  "j5InputPart": {
                    "id": "13",
                    "sequencePart": {
                      "id": "25",
                      "name": "ssrA_tag_5prime",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                }
              ],
              "sequence": {
                "id": "47",
                "name": "PCR1-1",
                "circular": null,
                "description": null,
                "size": 806,
                "hash": "e4d59b906bf6307625ab0e6be8d0436afec09bef4b7bd0fad8629d0098ed278a",
                "polynucleotideMaterialId": null,
                "isJ5Sequence": true,
                "sequenceParts": [],
                "sequenceSegments": [
                  {
                    "id": "80",
                    "start": 0,
                    "end": 805,
                    "strand": 1,
                    "sourceSequencePart": null,
                    "__typename": "sequenceSegment"
                  }
                ],
                "sequenceFeatures": [],
                "__typename": "sequence"
              },
              "__typename": "j5AssemblyPiece"
            },
            "__typename": "j5ConstructAssemblyPiece"
          }
        ],
        "__typename": "j5RunConstruct"
      },
      {
        "id": "12",
        "name": "Construct 8",
        "sequence": {
          "id": "55",
          "name": "Construct 8",
          "circular": true,
          "description": "pS8c-vector_backbone,ccmN_nterm_sig_pep,short_gly_ser_linker,GFPuv,ssrA_tag_enhanced_5prime,ssrA_tag_3prime",
          "size": 5353,
          "hash": "687aeb5e3962830455cff33fbd5091faa96c6dabba1f1873935f6e828b0c70e0",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [
            {
              "id": "30",
              "cid": "NLP1-undefined-5733",
              "name": "short_gly_ser_linker",
              "__typename": "sequencePart"
            }
          ],
          "sequenceSegments": [
            {
              "id": "103",
              "start": 2070,
              "end": 1238,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "104",
              "start": 1239,
              "end": 1295,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "105",
              "start": 1296,
              "end": 1319,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "106",
              "start": 1320,
              "end": 2030,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "107",
              "start": 2031,
              "end": 2051,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "108",
              "start": 2052,
              "end": 2069,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [
            {
              "id": "301",
              "start": 6,
              "end": 885,
              "type": "CDS",
              "name": "araC",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "302",
              "start": 913,
              "end": 931,
              "type": "protein_bind",
              "name": "operator O2",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "303",
              "start": 1035,
              "end": 1064,
              "type": "promoter",
              "name": "araC promoter",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "304",
              "start": 1071,
              "end": 1093,
              "type": "protein_bind",
              "name": "operator O1",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "305",
              "start": 1114,
              "end": 1128,
              "type": "misc_binding",
              "name": "CAP site",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "306",
              "start": 1123,
              "end": 1162,
              "type": "protein_bind",
              "name": "Operator I2 and I1",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "307",
              "start": 1160,
              "end": 1188,
              "type": "promoter",
              "name": "pBAD promoter",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "308",
              "start": 1206,
              "end": 1299,
              "type": "primer_bind",
              "name": "Oligo 2 (pS8c-vector_backbone) (ccmN_nterm_sig_pep) Reverse",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "309",
              "start": 1215,
              "end": 1235,
              "type": "RBS",
              "name": "RBS",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "310",
              "start": 1235,
              "end": 2072,
              "type": "CDS",
              "name": "GFPuv",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "311",
              "start": 1238,
              "end": 1295,
              "type": "misc_feature",
              "name": "ccmN_sig_pep",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "312",
              "start": 1295,
              "end": 1319,
              "type": "misc_feature",
              "name": "gly_ser_linker",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "313",
              "start": 1295,
              "end": 1351,
              "type": "primer_bind",
              "name": "Oligo 3 (short_gly_ser_linker) (GFPuv) Forward",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "314",
              "start": 1738,
              "end": 1739,
              "type": "misc_feature",
              "name": "XhoI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "315",
              "start": 1837,
              "end": 1838,
              "type": "misc_feature",
              "name": "BamHI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "316",
              "start": 2012,
              "end": 2055,
              "type": "primer_bind",
              "name": "Oligo 4 (GFPuv) (ssrA_tag_enhanced_5prime) Reverse",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "317",
              "start": 2030,
              "end": 2051,
              "type": "misc_feature",
              "name": "ssrA tag enhanced",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "318",
              "start": 2051,
              "end": 2069,
              "type": "misc_feature",
              "name": "ssrA tag",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "319",
              "start": 2051,
              "end": 2094,
              "type": "primer_bind",
              "name": "Oligo 1 (ssrA_tag_3prime) (pS8c-vector_backbone) Forward",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "320",
              "start": 2087,
              "end": 2216,
              "type": "terminator",
              "name": "dbl term",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "321",
              "start": 2217,
              "end": 4446,
              "type": "rep_origin",
              "name": "pSC101**",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "322",
              "start": 4446,
              "end": 4552,
              "type": "terminator",
              "name": "T0",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "323",
              "start": 4567,
              "end": 5227,
              "type": "misc_marker",
              "name": "CmR",
              "strand": -1,
              "__typename": "sequenceFeature"
            }
          ],
          "__typename": "sequence"
        },
        "j5ConstructAssemblyPieces": [
          {
            "id": "23",
            "index": 0,
            "assemblyPiece": {
              "id": "12",
              "name": "AP1-5",
              "type": "PCR",
              "j5AssemblyPieceParts": [
                {
                  "id": "34",
                  "j5InputPart": {
                    "id": "14",
                    "sequencePart": {
                      "id": "26",
                      "name": "ssrA_tag_3prime",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "35",
                  "j5InputPart": {
                    "id": "11",
                    "sequencePart": {
                      "id": "19",
                      "name": "pS8c-vector_backbone",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "36",
                  "j5InputPart": {
                    "id": "17",
                    "sequencePart": {
                      "id": "24",
                      "name": "ccmN_nterm_sig_pep",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                }
              ],
              "sequence": {
                "id": "51",
                "name": "PCR1-5",
                "circular": null,
                "description": null,
                "size": 4629,
                "hash": "16b8dde7975374a940f75356a00802d81cac1827f20d3ac8393117c556533576",
                "polynucleotideMaterialId": null,
                "isJ5Sequence": true,
                "sequenceParts": [],
                "sequenceSegments": [
                  {
                    "id": "84",
                    "start": 0,
                    "end": 4628,
                    "strand": 1,
                    "sourceSequencePart": null,
                    "__typename": "sequenceSegment"
                  }
                ],
                "sequenceFeatures": [],
                "__typename": "sequence"
              },
              "__typename": "j5AssemblyPiece"
            },
            "__typename": "j5ConstructAssemblyPiece"
          },
          {
            "id": "24",
            "index": 1,
            "assemblyPiece": {
              "id": "11",
              "name": "AP1-4",
              "type": "PCR",
              "j5AssemblyPieceParts": [
                {
                  "id": "31",
                  "j5InputPart": {
                    "id": "18",
                    "sequencePart": {
                      "id": "23",
                      "name": "short_gly_ser_linker",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "32",
                  "j5InputPart": {
                    "id": "10",
                    "sequencePart": {
                      "id": "18",
                      "name": "GFPuv",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "33",
                  "j5InputPart": {
                    "id": "12",
                    "sequencePart": {
                      "id": "20",
                      "name": "ssrA_tag_enhanced_5prime",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                }
              ],
              "sequence": {
                "id": "50",
                "name": "PCR1-4",
                "circular": null,
                "description": null,
                "size": 788,
                "hash": "0891859169f4df8b8726df64429e21cb6c5b4e907ed95c5b4ff3c01aad031431",
                "polynucleotideMaterialId": null,
                "isJ5Sequence": true,
                "sequenceParts": [],
                "sequenceSegments": [
                  {
                    "id": "83",
                    "start": 0,
                    "end": 787,
                    "strand": 1,
                    "sourceSequencePart": null,
                    "__typename": "sequenceSegment"
                  }
                ],
                "sequenceFeatures": [],
                "__typename": "sequence"
              },
              "__typename": "j5AssemblyPiece"
            },
            "__typename": "j5ConstructAssemblyPiece"
          }
        ],
        "__typename": "j5RunConstruct"
      },
      {
        "id": "13",
        "name": "Construct 6",
        "sequence": {
          "id": "56",
          "name": "Construct 6",
          "circular": true,
          "description": "pS8c-vector_backbone,ccmN_nterm_sig_pep,long_gly_ser_linker,GFPuv,ssrA_tag_enhanced_5prime,ssrA_tag_3prime",
          "size": 5377,
          "hash": "c79b3f98ad11fddb836c33139905adeadcd353788bc873a4068e237d2da8ee8c",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [
            {
              "id": "31",
              "cid": "NLP1-undefined-5735",
              "name": "short_gly_ser_linker",
              "__typename": "sequencePart"
            }
          ],
          "sequenceSegments": [
            {
              "id": "109",
              "start": 2094,
              "end": 1238,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "110",
              "start": 1239,
              "end": 1295,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "111",
              "start": 1296,
              "end": 1343,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "112",
              "start": 1344,
              "end": 2054,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "113",
              "start": 2055,
              "end": 2075,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "114",
              "start": 2076,
              "end": 2093,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [
            {
              "id": "324",
              "start": 6,
              "end": 885,
              "type": "CDS",
              "name": "araC",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "325",
              "start": 913,
              "end": 931,
              "type": "protein_bind",
              "name": "operator O2",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "326",
              "start": 1035,
              "end": 1064,
              "type": "promoter",
              "name": "araC promoter",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "327",
              "start": 1071,
              "end": 1093,
              "type": "protein_bind",
              "name": "operator O1",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "328",
              "start": 1114,
              "end": 1128,
              "type": "misc_binding",
              "name": "CAP site",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "329",
              "start": 1123,
              "end": 1162,
              "type": "protein_bind",
              "name": "Operator I2 and I1",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "330",
              "start": 1160,
              "end": 1188,
              "type": "promoter",
              "name": "pBAD promoter",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "331",
              "start": 1206,
              "end": 1299,
              "type": "primer_bind",
              "name": "Oligo 2 (pS8c-vector_backbone) (ccmN_nterm_sig_pep) Reverse",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "332",
              "start": 1215,
              "end": 1235,
              "type": "RBS",
              "name": "RBS",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "333",
              "start": 1235,
              "end": 2096,
              "type": "CDS",
              "name": "GFPuv",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "334",
              "start": 1238,
              "end": 1295,
              "type": "misc_feature",
              "name": "ccmN_sig_pep",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "335",
              "start": 1295,
              "end": 1343,
              "type": "misc_feature",
              "name": "gly_ser_linker",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "336",
              "start": 1295,
              "end": 1375,
              "type": "primer_bind",
              "name": "Oligo 3 (long_gly_ser_linker) (GFPuv) Forward",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "337",
              "start": 1762,
              "end": 1763,
              "type": "misc_feature",
              "name": "XhoI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "338",
              "start": 1861,
              "end": 1862,
              "type": "misc_feature",
              "name": "BamHI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "339",
              "start": 2036,
              "end": 2079,
              "type": "primer_bind",
              "name": "Oligo 4 (GFPuv) (ssrA_tag_enhanced_5prime) Reverse",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "340",
              "start": 2054,
              "end": 2075,
              "type": "misc_feature",
              "name": "ssrA tag enhanced",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "341",
              "start": 2075,
              "end": 2093,
              "type": "misc_feature",
              "name": "ssrA tag",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "342",
              "start": 2075,
              "end": 2118,
              "type": "primer_bind",
              "name": "Oligo 1 (ssrA_tag_3prime) (pS8c-vector_backbone) Forward",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "343",
              "start": 2111,
              "end": 2240,
              "type": "terminator",
              "name": "dbl term",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "344",
              "start": 2241,
              "end": 4470,
              "type": "rep_origin",
              "name": "pSC101**",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "345",
              "start": 4470,
              "end": 4576,
              "type": "terminator",
              "name": "T0",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "346",
              "start": 4591,
              "end": 5251,
              "type": "misc_marker",
              "name": "CmR",
              "strand": -1,
              "__typename": "sequenceFeature"
            }
          ],
          "__typename": "sequence"
        },
        "j5ConstructAssemblyPieces": [
          {
            "id": "25",
            "index": 0,
            "assemblyPiece": {
              "id": "12",
              "name": "AP1-5",
              "type": "PCR",
              "j5AssemblyPieceParts": [
                {
                  "id": "34",
                  "j5InputPart": {
                    "id": "14",
                    "sequencePart": {
                      "id": "26",
                      "name": "ssrA_tag_3prime",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "35",
                  "j5InputPart": {
                    "id": "11",
                    "sequencePart": {
                      "id": "19",
                      "name": "pS8c-vector_backbone",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "36",
                  "j5InputPart": {
                    "id": "17",
                    "sequencePart": {
                      "id": "24",
                      "name": "ccmN_nterm_sig_pep",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                }
              ],
              "sequence": {
                "id": "51",
                "name": "PCR1-5",
                "circular": null,
                "description": null,
                "size": 4629,
                "hash": "16b8dde7975374a940f75356a00802d81cac1827f20d3ac8393117c556533576",
                "polynucleotideMaterialId": null,
                "isJ5Sequence": true,
                "sequenceParts": [],
                "sequenceSegments": [
                  {
                    "id": "84",
                    "start": 0,
                    "end": 4628,
                    "strand": 1,
                    "sourceSequencePart": null,
                    "__typename": "sequenceSegment"
                  }
                ],
                "sequenceFeatures": [],
                "__typename": "sequence"
              },
              "__typename": "j5AssemblyPiece"
            },
            "__typename": "j5ConstructAssemblyPiece"
          },
          {
            "id": "26",
            "index": 1,
            "assemblyPiece": {
              "id": "9",
              "name": "AP1-2",
              "type": "PCR",
              "j5AssemblyPieceParts": [
                {
                  "id": "25",
                  "j5InputPart": {
                    "id": "16",
                    "sequencePart": {
                      "id": "22",
                      "name": "long_gly_ser_linker",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "26",
                  "j5InputPart": {
                    "id": "10",
                    "sequencePart": {
                      "id": "18",
                      "name": "GFPuv",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "27",
                  "j5InputPart": {
                    "id": "12",
                    "sequencePart": {
                      "id": "20",
                      "name": "ssrA_tag_enhanced_5prime",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                }
              ],
              "sequence": {
                "id": "48",
                "name": "PCR1-2",
                "circular": null,
                "description": null,
                "size": 812,
                "hash": "f1c29c6d8a72aaa7fdbf90c68db14a8c4cb70f394387fae10741da5c88846b8e",
                "polynucleotideMaterialId": null,
                "isJ5Sequence": true,
                "sequenceParts": [],
                "sequenceSegments": [
                  {
                    "id": "81",
                    "start": 0,
                    "end": 811,
                    "strand": 1,
                    "sourceSequencePart": null,
                    "__typename": "sequenceSegment"
                  }
                ],
                "sequenceFeatures": [],
                "__typename": "sequence"
              },
              "__typename": "j5AssemblyPiece"
            },
            "__typename": "j5ConstructAssemblyPiece"
          }
        ],
        "__typename": "j5RunConstruct"
      },
      {
        "id": "14",
        "name": "Construct 2",
        "sequence": {
          "id": "57",
          "name": "Construct 2",
          "circular": true,
          "description": "pS8c-vector_backbone,BMC_nterm_sig_pep,long_gly_ser_linker,GFPuv,ssrA_tag_enhanced_5prime,ssrA_tag_3prime",
          "size": 5371,
          "hash": "39a3aa8f71bfea22aec253078f7aeab4173e58b640aefefa754da0cfa00e98de",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [
            {
              "id": "32",
              "cid": "NLP1-undefined-5728",
              "name": "short_gly_ser_linker",
              "__typename": "sequencePart"
            }
          ],
          "sequenceSegments": [
            {
              "id": "115",
              "start": 2088,
              "end": 1238,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "116",
              "start": 1239,
              "end": 1289,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "117",
              "start": 1290,
              "end": 1337,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "118",
              "start": 1338,
              "end": 2048,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "119",
              "start": 2049,
              "end": 2069,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "120",
              "start": 2070,
              "end": 2087,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [
            {
              "id": "347",
              "start": 6,
              "end": 885,
              "type": "CDS",
              "name": "araC",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "348",
              "start": 913,
              "end": 931,
              "type": "protein_bind",
              "name": "operator O2",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "349",
              "start": 1035,
              "end": 1064,
              "type": "promoter",
              "name": "araC promoter",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "350",
              "start": 1071,
              "end": 1093,
              "type": "protein_bind",
              "name": "operator O1",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "351",
              "start": 1114,
              "end": 1128,
              "type": "misc_binding",
              "name": "CAP site",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "352",
              "start": 1123,
              "end": 1162,
              "type": "protein_bind",
              "name": "Operator I2 and I1",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "353",
              "start": 1160,
              "end": 1188,
              "type": "promoter",
              "name": "pBAD promoter",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "354",
              "start": 1206,
              "end": 1293,
              "type": "primer_bind",
              "name": "Oligo 2 (pS8c-vector_backbone) (BMC_nterm_sig_pep) Reverse",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "355",
              "start": 1215,
              "end": 1235,
              "type": "RBS",
              "name": "RBS",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "356",
              "start": 1235,
              "end": 2090,
              "type": "CDS",
              "name": "GFPuv",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "357",
              "start": 1238,
              "end": 1289,
              "type": "misc_feature",
              "name": "Clostridium_BMC_sig_pep",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "358",
              "start": 1289,
              "end": 1337,
              "type": "misc_feature",
              "name": "gly_ser_linker",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "359",
              "start": 1289,
              "end": 1369,
              "type": "primer_bind",
              "name": "Oligo 3 (long_gly_ser_linker) (GFPuv) Forward",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "360",
              "start": 1756,
              "end": 1757,
              "type": "misc_feature",
              "name": "XhoI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "361",
              "start": 1855,
              "end": 1856,
              "type": "misc_feature",
              "name": "BamHI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "362",
              "start": 2030,
              "end": 2073,
              "type": "primer_bind",
              "name": "Oligo 4 (GFPuv) (ssrA_tag_enhanced_5prime) Reverse",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "363",
              "start": 2048,
              "end": 2069,
              "type": "misc_feature",
              "name": "ssrA tag enhanced",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "364",
              "start": 2069,
              "end": 2087,
              "type": "misc_feature",
              "name": "ssrA tag",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "365",
              "start": 2069,
              "end": 2112,
              "type": "primer_bind",
              "name": "Oligo 1 (ssrA_tag_3prime) (pS8c-vector_backbone) Forward",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "366",
              "start": 2105,
              "end": 2234,
              "type": "terminator",
              "name": "dbl term",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "367",
              "start": 2235,
              "end": 4464,
              "type": "rep_origin",
              "name": "pSC101**",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "368",
              "start": 4464,
              "end": 4570,
              "type": "terminator",
              "name": "T0",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "369",
              "start": 4585,
              "end": 5245,
              "type": "misc_marker",
              "name": "CmR",
              "strand": -1,
              "__typename": "sequenceFeature"
            }
          ],
          "__typename": "sequence"
        },
        "j5ConstructAssemblyPieces": [
          {
            "id": "27",
            "index": 0,
            "assemblyPiece": {
              "id": "7",
              "name": "AP1-0",
              "type": "PCR",
              "j5AssemblyPieceParts": [
                {
                  "id": "19",
                  "j5InputPart": {
                    "id": "14",
                    "sequencePart": {
                      "id": "26",
                      "name": "ssrA_tag_3prime",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "20",
                  "j5InputPart": {
                    "id": "11",
                    "sequencePart": {
                      "id": "19",
                      "name": "pS8c-vector_backbone",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "21",
                  "j5InputPart": {
                    "id": "15",
                    "sequencePart": {
                      "id": "21",
                      "name": "BMC_nterm_sig_pep",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                }
              ],
              "sequence": {
                "id": "46",
                "name": "PCR1-0",
                "circular": null,
                "description": null,
                "size": 4623,
                "hash": "fb9911fb5b38343d5765987778fb819cb8c112d32a283468e15eafa5ab6f7673",
                "polynucleotideMaterialId": null,
                "isJ5Sequence": true,
                "sequenceParts": [],
                "sequenceSegments": [
                  {
                    "id": "79",
                    "start": 0,
                    "end": 4622,
                    "strand": 1,
                    "sourceSequencePart": null,
                    "__typename": "sequenceSegment"
                  }
                ],
                "sequenceFeatures": [],
                "__typename": "sequence"
              },
              "__typename": "j5AssemblyPiece"
            },
            "__typename": "j5ConstructAssemblyPiece"
          },
          {
            "id": "28",
            "index": 1,
            "assemblyPiece": {
              "id": "9",
              "name": "AP1-2",
              "type": "PCR",
              "j5AssemblyPieceParts": [
                {
                  "id": "25",
                  "j5InputPart": {
                    "id": "16",
                    "sequencePart": {
                      "id": "22",
                      "name": "long_gly_ser_linker",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "26",
                  "j5InputPart": {
                    "id": "10",
                    "sequencePart": {
                      "id": "18",
                      "name": "GFPuv",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "27",
                  "j5InputPart": {
                    "id": "12",
                    "sequencePart": {
                      "id": "20",
                      "name": "ssrA_tag_enhanced_5prime",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                }
              ],
              "sequence": {
                "id": "48",
                "name": "PCR1-2",
                "circular": null,
                "description": null,
                "size": 812,
                "hash": "f1c29c6d8a72aaa7fdbf90c68db14a8c4cb70f394387fae10741da5c88846b8e",
                "polynucleotideMaterialId": null,
                "isJ5Sequence": true,
                "sequenceParts": [],
                "sequenceSegments": [
                  {
                    "id": "81",
                    "start": 0,
                    "end": 811,
                    "strand": 1,
                    "sourceSequencePart": null,
                    "__typename": "sequenceSegment"
                  }
                ],
                "sequenceFeatures": [],
                "__typename": "sequence"
              },
              "__typename": "j5AssemblyPiece"
            },
            "__typename": "j5ConstructAssemblyPiece"
          }
        ],
        "__typename": "j5RunConstruct"
      },
      {
        "id": "15",
        "name": "Construct 1",
        "sequence": {
          "id": "58",
          "name": "Construct 1",
          "circular": true,
          "description": "pS8c-vector_backbone,BMC_nterm_sig_pep,long_gly_ser_linker,GFPuv,ssrA_tag_5prime,ssrA_tag_3prime",
          "size": 5365,
          "hash": "09bd0ce41849d0f8d776da01d742707d863b14f5b29da2fb023882e6b157ac2f",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [
            {
              "id": "33",
              "cid": "NLP1-undefined-5729",
              "name": "short_gly_ser_linker",
              "__typename": "sequencePart"
            }
          ],
          "sequenceSegments": [
            {
              "id": "121",
              "start": 2082,
              "end": 1238,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "122",
              "start": 1239,
              "end": 1289,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "123",
              "start": 1290,
              "end": 1337,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "124",
              "start": 1338,
              "end": 2048,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "125",
              "start": 2049,
              "end": 2063,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "126",
              "start": 2064,
              "end": 2081,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [
            {
              "id": "370",
              "start": 6,
              "end": 885,
              "type": "CDS",
              "name": "araC",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "371",
              "start": 913,
              "end": 931,
              "type": "protein_bind",
              "name": "operator O2",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "372",
              "start": 1035,
              "end": 1064,
              "type": "promoter",
              "name": "araC promoter",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "373",
              "start": 1071,
              "end": 1093,
              "type": "protein_bind",
              "name": "operator O1",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "374",
              "start": 1114,
              "end": 1128,
              "type": "misc_binding",
              "name": "CAP site",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "375",
              "start": 1123,
              "end": 1162,
              "type": "protein_bind",
              "name": "Operator I2 and I1",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "376",
              "start": 1160,
              "end": 1188,
              "type": "promoter",
              "name": "pBAD promoter",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "377",
              "start": 1206,
              "end": 1293,
              "type": "primer_bind",
              "name": "Oligo 2 (pS8c-vector_backbone) (BMC_nterm_sig_pep) Reverse",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "378",
              "start": 1215,
              "end": 1235,
              "type": "RBS",
              "name": "RBS",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "379",
              "start": 1235,
              "end": 2084,
              "type": "CDS",
              "name": "GFPuv",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "380",
              "start": 1238,
              "end": 1289,
              "type": "misc_feature",
              "name": "Clostridium_BMC_sig_pep",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "381",
              "start": 1289,
              "end": 1337,
              "type": "misc_feature",
              "name": "gly_ser_linker",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "382",
              "start": 1289,
              "end": 1369,
              "type": "primer_bind",
              "name": "Oligo 3 (long_gly_ser_linker) (GFPuv) Forward",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "383",
              "start": 1756,
              "end": 1757,
              "type": "misc_feature",
              "name": "XhoI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "384",
              "start": 1855,
              "end": 1856,
              "type": "misc_feature",
              "name": "BamHI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "385",
              "start": 2030,
              "end": 2067,
              "type": "primer_bind",
              "name": "Oligo 4 (GFPuv) (ssrA_tag_5prime) Reverse",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "386",
              "start": 2048,
              "end": 2081,
              "type": "misc_feature",
              "name": "ssrA tag",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "387",
              "start": 2063,
              "end": 2106,
              "type": "primer_bind",
              "name": "Oligo 1 (ssrA_tag_3prime) (pS8c-vector_backbone) Forward",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "388",
              "start": 2099,
              "end": 2228,
              "type": "terminator",
              "name": "dbl term",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "389",
              "start": 2229,
              "end": 4458,
              "type": "rep_origin",
              "name": "pSC101**",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "390",
              "start": 4458,
              "end": 4564,
              "type": "terminator",
              "name": "T0",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "391",
              "start": 4579,
              "end": 5239,
              "type": "misc_marker",
              "name": "CmR",
              "strand": -1,
              "__typename": "sequenceFeature"
            }
          ],
          "__typename": "sequence"
        },
        "j5ConstructAssemblyPieces": [
          {
            "id": "29",
            "index": 0,
            "assemblyPiece": {
              "id": "7",
              "name": "AP1-0",
              "type": "PCR",
              "j5AssemblyPieceParts": [
                {
                  "id": "19",
                  "j5InputPart": {
                    "id": "14",
                    "sequencePart": {
                      "id": "26",
                      "name": "ssrA_tag_3prime",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "20",
                  "j5InputPart": {
                    "id": "11",
                    "sequencePart": {
                      "id": "19",
                      "name": "pS8c-vector_backbone",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "21",
                  "j5InputPart": {
                    "id": "15",
                    "sequencePart": {
                      "id": "21",
                      "name": "BMC_nterm_sig_pep",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                }
              ],
              "sequence": {
                "id": "46",
                "name": "PCR1-0",
                "circular": null,
                "description": null,
                "size": 4623,
                "hash": "fb9911fb5b38343d5765987778fb819cb8c112d32a283468e15eafa5ab6f7673",
                "polynucleotideMaterialId": null,
                "isJ5Sequence": true,
                "sequenceParts": [],
                "sequenceSegments": [
                  {
                    "id": "79",
                    "start": 0,
                    "end": 4622,
                    "strand": 1,
                    "sourceSequencePart": null,
                    "__typename": "sequenceSegment"
                  }
                ],
                "sequenceFeatures": [],
                "__typename": "sequence"
              },
              "__typename": "j5AssemblyPiece"
            },
            "__typename": "j5ConstructAssemblyPiece"
          },
          {
            "id": "30",
            "index": 1,
            "assemblyPiece": {
              "id": "8",
              "name": "AP1-1",
              "type": "PCR",
              "j5AssemblyPieceParts": [
                {
                  "id": "22",
                  "j5InputPart": {
                    "id": "16",
                    "sequencePart": {
                      "id": "22",
                      "name": "long_gly_ser_linker",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "23",
                  "j5InputPart": {
                    "id": "10",
                    "sequencePart": {
                      "id": "18",
                      "name": "GFPuv",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "24",
                  "j5InputPart": {
                    "id": "13",
                    "sequencePart": {
                      "id": "25",
                      "name": "ssrA_tag_5prime",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                }
              ],
              "sequence": {
                "id": "47",
                "name": "PCR1-1",
                "circular": null,
                "description": null,
                "size": 806,
                "hash": "e4d59b906bf6307625ab0e6be8d0436afec09bef4b7bd0fad8629d0098ed278a",
                "polynucleotideMaterialId": null,
                "isJ5Sequence": true,
                "sequenceParts": [],
                "sequenceSegments": [
                  {
                    "id": "80",
                    "start": 0,
                    "end": 805,
                    "strand": 1,
                    "sourceSequencePart": null,
                    "__typename": "sequenceSegment"
                  }
                ],
                "sequenceFeatures": [],
                "__typename": "sequence"
              },
              "__typename": "j5AssemblyPiece"
            },
            "__typename": "j5ConstructAssemblyPiece"
          }
        ],
        "__typename": "j5RunConstruct"
      },
      {
        "id": "16",
        "name": "Construct 4",
        "sequence": {
          "id": "59",
          "name": "Construct 4",
          "circular": true,
          "description": "pS8c-vector_backbone,BMC_nterm_sig_pep,short_gly_ser_linker,GFPuv,ssrA_tag_enhanced_5prime,ssrA_tag_3prime",
          "size": 5347,
          "hash": "06b2cb7e7448257d30f3faab8acedb18f04e3b627529ef58ec1eff6ec5ca1cdf",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [
            {
              "id": "34",
              "cid": "NLP1-undefined-5732",
              "name": "short_gly_ser_linker",
              "__typename": "sequencePart"
            }
          ],
          "sequenceSegments": [
            {
              "id": "127",
              "start": 2064,
              "end": 1238,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "128",
              "start": 1239,
              "end": 1289,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "129",
              "start": 1290,
              "end": 1313,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "130",
              "start": 1314,
              "end": 2024,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "131",
              "start": 2025,
              "end": 2045,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            },
            {
              "id": "132",
              "start": 2046,
              "end": 2063,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [
            {
              "id": "392",
              "start": 6,
              "end": 885,
              "type": "CDS",
              "name": "araC",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "393",
              "start": 913,
              "end": 931,
              "type": "protein_bind",
              "name": "operator O2",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "394",
              "start": 1035,
              "end": 1064,
              "type": "promoter",
              "name": "araC promoter",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "395",
              "start": 1071,
              "end": 1093,
              "type": "protein_bind",
              "name": "operator O1",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "396",
              "start": 1114,
              "end": 1128,
              "type": "misc_binding",
              "name": "CAP site",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "397",
              "start": 1123,
              "end": 1162,
              "type": "protein_bind",
              "name": "Operator I2 and I1",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "398",
              "start": 1160,
              "end": 1188,
              "type": "promoter",
              "name": "pBAD promoter",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "399",
              "start": 1206,
              "end": 1293,
              "type": "primer_bind",
              "name": "Oligo 2 (pS8c-vector_backbone) (BMC_nterm_sig_pep) Reverse",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "400",
              "start": 1215,
              "end": 1235,
              "type": "RBS",
              "name": "RBS",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "401",
              "start": 1235,
              "end": 2066,
              "type": "CDS",
              "name": "GFPuv",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "402",
              "start": 1238,
              "end": 1289,
              "type": "misc_feature",
              "name": "Clostridium_BMC_sig_pep",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "403",
              "start": 1289,
              "end": 1313,
              "type": "misc_feature",
              "name": "gly_ser_linker",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "404",
              "start": 1289,
              "end": 1345,
              "type": "primer_bind",
              "name": "Oligo 3 (short_gly_ser_linker) (GFPuv) Forward",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "405",
              "start": 1732,
              "end": 1733,
              "type": "misc_feature",
              "name": "XhoI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "406",
              "start": 1831,
              "end": 1832,
              "type": "misc_feature",
              "name": "BamHI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "407",
              "start": 2006,
              "end": 2049,
              "type": "primer_bind",
              "name": "Oligo 4 (GFPuv) (ssrA_tag_enhanced_5prime) Reverse",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "408",
              "start": 2024,
              "end": 2045,
              "type": "misc_feature",
              "name": "ssrA tag enhanced",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "409",
              "start": 2045,
              "end": 2063,
              "type": "misc_feature",
              "name": "ssrA tag",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "410",
              "start": 2045,
              "end": 2088,
              "type": "primer_bind",
              "name": "Oligo 1 (ssrA_tag_3prime) (pS8c-vector_backbone) Forward",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "411",
              "start": 2081,
              "end": 2210,
              "type": "terminator",
              "name": "dbl term",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "412",
              "start": 2211,
              "end": 4440,
              "type": "rep_origin",
              "name": "pSC101**",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "413",
              "start": 4440,
              "end": 4546,
              "type": "terminator",
              "name": "T0",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "414",
              "start": 4561,
              "end": 5221,
              "type": "misc_marker",
              "name": "CmR",
              "strand": -1,
              "__typename": "sequenceFeature"
            }
          ],
          "__typename": "sequence"
        },
        "j5ConstructAssemblyPieces": [
          {
            "id": "31",
            "index": 0,
            "assemblyPiece": {
              "id": "7",
              "name": "AP1-0",
              "type": "PCR",
              "j5AssemblyPieceParts": [
                {
                  "id": "19",
                  "j5InputPart": {
                    "id": "14",
                    "sequencePart": {
                      "id": "26",
                      "name": "ssrA_tag_3prime",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "20",
                  "j5InputPart": {
                    "id": "11",
                    "sequencePart": {
                      "id": "19",
                      "name": "pS8c-vector_backbone",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "21",
                  "j5InputPart": {
                    "id": "15",
                    "sequencePart": {
                      "id": "21",
                      "name": "BMC_nterm_sig_pep",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                }
              ],
              "sequence": {
                "id": "46",
                "name": "PCR1-0",
                "circular": null,
                "description": null,
                "size": 4623,
                "hash": "fb9911fb5b38343d5765987778fb819cb8c112d32a283468e15eafa5ab6f7673",
                "polynucleotideMaterialId": null,
                "isJ5Sequence": true,
                "sequenceParts": [],
                "sequenceSegments": [
                  {
                    "id": "79",
                    "start": 0,
                    "end": 4622,
                    "strand": 1,
                    "sourceSequencePart": null,
                    "__typename": "sequenceSegment"
                  }
                ],
                "sequenceFeatures": [],
                "__typename": "sequence"
              },
              "__typename": "j5AssemblyPiece"
            },
            "__typename": "j5ConstructAssemblyPiece"
          },
          {
            "id": "32",
            "index": 1,
            "assemblyPiece": {
              "id": "11",
              "name": "AP1-4",
              "type": "PCR",
              "j5AssemblyPieceParts": [
                {
                  "id": "31",
                  "j5InputPart": {
                    "id": "18",
                    "sequencePart": {
                      "id": "23",
                      "name": "short_gly_ser_linker",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "32",
                  "j5InputPart": {
                    "id": "10",
                    "sequencePart": {
                      "id": "18",
                      "name": "GFPuv",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                },
                {
                  "id": "33",
                  "j5InputPart": {
                    "id": "12",
                    "sequencePart": {
                      "id": "20",
                      "name": "ssrA_tag_enhanced_5prime",
                      "__typename": "sequencePart"
                    },
                    "__typename": "j5InputPart"
                  },
                  "__typename": "j5AssemblyPiecePart"
                }
              ],
              "sequence": {
                "id": "50",
                "name": "PCR1-4",
                "circular": null,
                "description": null,
                "size": 788,
                "hash": "0891859169f4df8b8726df64429e21cb6c5b4e907ed95c5b4ff3c01aad031431",
                "polynucleotideMaterialId": null,
                "isJ5Sequence": true,
                "sequenceParts": [],
                "sequenceSegments": [
                  {
                    "id": "83",
                    "start": 0,
                    "end": 787,
                    "strand": 1,
                    "sourceSequencePart": null,
                    "__typename": "sequenceSegment"
                  }
                ],
                "sequenceFeatures": [],
                "__typename": "sequence"
              },
              "__typename": "j5AssemblyPiece"
            },
            "__typename": "j5ConstructAssemblyPiece"
          }
        ],
        "__typename": "j5RunConstruct"
      }
    ],
    "j5InputSequences": [
      {
        "id": "6",
        "isStock": true,
        "sequence": {
          "id": "34",
          "name": "pj5_00001",
          "circular": true,
          "description": "",
          "size": 5299,
          "hash": "1e0ac0ee7c31b5855172c24b72fc8b92e63e520012c4221f1d7466014fa5022b",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [
            {
              "id": "18",
              "cid": "1-24096",
              "name": "GFPuv",
              "__typename": "sequencePart"
            },
            {
              "id": "19",
              "cid": "1-24097",
              "name": "pS8c-vector_backbone",
              "__typename": "sequencePart"
            }
          ],
          "sequenceSegments": [
            {
              "id": "67",
              "start": 0,
              "end": 5298,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [
            {
              "id": "208",
              "start": 913,
              "end": 931,
              "type": "protein_bind",
              "name": "operator O2",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "209",
              "start": 4392,
              "end": 4498,
              "type": "terminator",
              "name": "T0",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "210",
              "start": 2163,
              "end": 4392,
              "type": "rep_origin",
              "name": "pSC101**",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "211",
              "start": 1952,
              "end": 2015,
              "type": "CDS",
              "name": "signal_peptide",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "212",
              "start": 1215,
              "end": 1235,
              "type": "RBS",
              "name": "RBS",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "213",
              "start": 1160,
              "end": 1188,
              "type": "promoter",
              "name": "pBAD promoter",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "214",
              "start": 1114,
              "end": 1128,
              "type": "misc_binding",
              "name": "CAP site",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "215",
              "start": 1035,
              "end": 1064,
              "type": "promoter",
              "name": "araC promoter",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "216",
              "start": 6,
              "end": 885,
              "type": "CDS",
              "name": "araC",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "217",
              "start": 1759,
              "end": 1760,
              "type": "misc_feature",
              "name": "BamHI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "218",
              "start": 1660,
              "end": 1661,
              "type": "misc_feature",
              "name": "XhoI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "219",
              "start": 1235,
              "end": 2018,
              "type": "CDS",
              "name": "GFPuv",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "220",
              "start": 4513,
              "end": 5173,
              "type": "misc_marker",
              "name": "CmR",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "221",
              "start": 2033,
              "end": 2162,
              "type": "terminator",
              "name": "dbl term",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "222",
              "start": 1123,
              "end": 1162,
              "type": "protein_bind",
              "name": "Operator I2 and I1",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "223",
              "start": 1071,
              "end": 1093,
              "type": "protein_bind",
              "name": "operator O1",
              "strand": 1,
              "__typename": "sequenceFeature"
            }
          ],
          "__typename": "sequence"
        },
        "j5InputParts": [
          {
            "id": "10",
            "sequencePart": {
              "id": "18",
              "cid": "1-24096",
              "name": "GFPuv",
              "start": 1242,
              "end": 1952,
              "strand": 1,
              "__typename": "sequencePart"
            },
            "__typename": "j5InputPart"
          },
          {
            "id": "11",
            "sequencePart": {
              "id": "19",
              "cid": "1-24097",
              "name": "pS8c-vector_backbone",
              "start": 2016,
              "end": 1238,
              "strand": 1,
              "__typename": "sequencePart"
            },
            "__typename": "j5InputPart"
          }
        ],
        "__typename": "j5InputSequence"
      },
      {
        "id": "7",
        "isStock": false,
        "sequence": {
          "id": "35",
          "name": "ssrA_tag_enhance",
          "circular": false,
          "description": "",
          "size": 39,
          "hash": "415c2b98afec152c43b54fa5bd80601c17bf43c2472ac7883cfee2d511a7965f",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [
            {
              "id": "20",
              "cid": "1-24605",
              "name": "ssrA_tag_enhanced_5prime",
              "__typename": "sequencePart"
            }
          ],
          "sequenceSegments": [
            {
              "id": "68",
              "start": 0,
              "end": 38,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [
            {
              "id": "224",
              "start": 0,
              "end": 39,
              "type": "CDS",
              "name": "GFPuv",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "225",
              "start": 0,
              "end": 39,
              "type": "misc_feature",
              "name": "ssrA tag enhanced",
              "strand": 1,
              "__typename": "sequenceFeature"
            }
          ],
          "__typename": "sequence"
        },
        "j5InputParts": [
          {
            "id": "12",
            "sequencePart": {
              "id": "20",
              "cid": "1-24605",
              "name": "ssrA_tag_enhanced_5prime",
              "start": 1,
              "end": 21,
              "strand": 1,
              "__typename": "sequencePart"
            },
            "__typename": "j5InputPart"
          }
        ],
        "__typename": "j5InputSequence"
      },
      {
        "id": "8",
        "isStock": false,
        "sequence": {
          "id": "36",
          "name": "BMC_nterm_sig_pe",
          "circular": false,
          "description": "",
          "size": 102,
          "hash": "e6105b69a26b2cfc699ba565b5e9cbd9623eefa82eae27ba9836fdd2a7c9ccd2",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [
            {
              "id": "21",
              "cid": "1-24608",
              "name": "BMC_nterm_sig_pep",
              "__typename": "sequencePart"
            },
            {
              "id": "22",
              "cid": "1-24609",
              "name": "long_gly_ser_linker",
              "__typename": "sequencePart"
            },
            {
              "id": "23",
              "cid": "1-24611",
              "name": "short_gly_ser_linker",
              "__typename": "sequencePart"
            }
          ],
          "sequenceSegments": [
            {
              "id": "69",
              "start": 0,
              "end": 101,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [
            {
              "id": "226",
              "start": 54,
              "end": 102,
              "type": "misc_feature",
              "name": "gly_ser_linker",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "227",
              "start": 3,
              "end": 54,
              "type": "misc_feature",
              "name": "Clostridium_BMC_sig_pep",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "228",
              "start": 0,
              "end": 102,
              "type": "CDS",
              "name": "GFPuv",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "229",
              "start": 55,
              "end": 78,
              "type": "misc_feature",
              "name": "5a987bd52e28e07b6b2fe578_24611_short_gly_ser_linker",
              "strand": 1,
              "__typename": "sequenceFeature"
            }
          ],
          "__typename": "sequence"
        },
        "j5InputParts": [
          {
            "id": "15",
            "sequencePart": {
              "id": "21",
              "cid": "1-24608",
              "name": "BMC_nterm_sig_pep",
              "start": 4,
              "end": 54,
              "strand": 1,
              "__typename": "sequencePart"
            },
            "__typename": "j5InputPart"
          },
          {
            "id": "16",
            "sequencePart": {
              "id": "22",
              "cid": "1-24609",
              "name": "long_gly_ser_linker",
              "start": 55,
              "end": 102,
              "strand": 1,
              "__typename": "sequencePart"
            },
            "__typename": "j5InputPart"
          },
          {
            "id": "18",
            "sequencePart": {
              "id": "23",
              "cid": "1-24611",
              "name": "short_gly_ser_linker",
              "start": 55,
              "end": 78,
              "strand": 1,
              "__typename": "sequencePart"
            },
            "__typename": "j5InputPart"
          }
        ],
        "__typename": "j5InputSequence"
      },
      {
        "id": "9",
        "isStock": false,
        "sequence": {
          "id": "37",
          "name": "ccmN_nterm_sig_p",
          "circular": false,
          "description": "",
          "size": 108,
          "hash": "a3fe363d52b29acb3523d25227875d79701892bf3db4746a0a656f5a0fd47f42",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [
            {
              "id": "24",
              "cid": "1-24610",
              "name": "ccmN_nterm_sig_pep",
              "__typename": "sequencePart"
            }
          ],
          "sequenceSegments": [
            {
              "id": "70",
              "start": 0,
              "end": 107,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [
            {
              "id": "230",
              "start": 0,
              "end": 108,
              "type": "CDS",
              "name": "GFPuv",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "231",
              "start": 60,
              "end": 108,
              "type": "misc_feature",
              "name": "gly_ser_linker",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "232",
              "start": 3,
              "end": 60,
              "type": "misc_feature",
              "name": "ccmN_sig_pep",
              "strand": 1,
              "__typename": "sequenceFeature"
            }
          ],
          "__typename": "sequence"
        },
        "j5InputParts": [
          {
            "id": "17",
            "sequencePart": {
              "id": "24",
              "cid": "1-24610",
              "name": "ccmN_nterm_sig_pep",
              "start": 4,
              "end": 60,
              "strand": 1,
              "__typename": "sequencePart"
            },
            "__typename": "j5InputPart"
          }
        ],
        "__typename": "j5InputSequence"
      },
      {
        "id": "10",
        "isStock": false,
        "sequence": {
          "id": "38",
          "name": "ssrA_tag_GFPuv",
          "circular": false,
          "description": "",
          "size": 33,
          "hash": "9f17d412c9a3822279c8b9ac057f9c0420f8e7491e533b75a1a9c241ef732756",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [
            {
              "id": "25",
              "cid": "1-24606",
              "name": "ssrA_tag_5prime",
              "__typename": "sequencePart"
            },
            {
              "id": "26",
              "cid": "1-24607",
              "name": "ssrA_tag_3prime",
              "__typename": "sequencePart"
            }
          ],
          "sequenceSegments": [
            {
              "id": "71",
              "start": 0,
              "end": 32,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [
            {
              "id": "233",
              "start": 0,
              "end": 33,
              "type": "CDS",
              "name": "GFPuv",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "234",
              "start": 0,
              "end": 33,
              "type": "misc_feature",
              "name": "ssrA tag",
              "strand": 1,
              "__typename": "sequenceFeature"
            }
          ],
          "__typename": "sequence"
        },
        "j5InputParts": [
          {
            "id": "13",
            "sequencePart": {
              "id": "25",
              "cid": "1-24606",
              "name": "ssrA_tag_5prime",
              "start": 1,
              "end": 15,
              "strand": 1,
              "__typename": "sequencePart"
            },
            "__typename": "j5InputPart"
          },
          {
            "id": "14",
            "sequencePart": {
              "id": "26",
              "cid": "1-24607",
              "name": "ssrA_tag_3prime",
              "start": 16,
              "end": 33,
              "strand": 1,
              "__typename": "sequencePart"
            },
            "__typename": "j5InputPart"
          }
        ],
        "__typename": "j5InputSequence"
      }
    ],
    "j5PcrReactions": [
      {
        "id": "7",
        "note": "PCR",
        "oligoDeltaTm": 13.797,
        "oligoDeltaTm3Prime": 2.869,
        "oligoMeanTm": 70.0525,
        "oligoMeanTm3Prime": 61.6195,
        "pcrProductSequence": {
          "id": "46",
          "name": "PCR1-0",
          "circular": null,
          "description": null,
          "size": 4623,
          "hash": "fb9911fb5b38343d5765987778fb819cb8c112d32a283468e15eafa5ab6f7673",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [],
          "sequenceSegments": [
            {
              "id": "79",
              "start": 0,
              "end": 4622,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [],
          "__typename": "sequence"
        },
        "primaryTemplate": {
          "id": "34",
          "name": "pj5_00001",
          "circular": true,
          "description": "",
          "size": 5299,
          "hash": "1e0ac0ee7c31b5855172c24b72fc8b92e63e520012c4221f1d7466014fa5022b",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [
            {
              "id": "18",
              "cid": "1-24096",
              "name": "GFPuv",
              "__typename": "sequencePart"
            },
            {
              "id": "19",
              "cid": "1-24097",
              "name": "pS8c-vector_backbone",
              "__typename": "sequencePart"
            }
          ],
          "sequenceSegments": [
            {
              "id": "67",
              "start": 0,
              "end": 5298,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [
            {
              "id": "208",
              "start": 913,
              "end": 931,
              "type": "protein_bind",
              "name": "operator O2",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "209",
              "start": 4392,
              "end": 4498,
              "type": "terminator",
              "name": "T0",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "210",
              "start": 2163,
              "end": 4392,
              "type": "rep_origin",
              "name": "pSC101**",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "211",
              "start": 1952,
              "end": 2015,
              "type": "CDS",
              "name": "signal_peptide",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "212",
              "start": 1215,
              "end": 1235,
              "type": "RBS",
              "name": "RBS",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "213",
              "start": 1160,
              "end": 1188,
              "type": "promoter",
              "name": "pBAD promoter",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "214",
              "start": 1114,
              "end": 1128,
              "type": "misc_binding",
              "name": "CAP site",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "215",
              "start": 1035,
              "end": 1064,
              "type": "promoter",
              "name": "araC promoter",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "216",
              "start": 6,
              "end": 885,
              "type": "CDS",
              "name": "araC",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "217",
              "start": 1759,
              "end": 1760,
              "type": "misc_feature",
              "name": "BamHI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "218",
              "start": 1660,
              "end": 1661,
              "type": "misc_feature",
              "name": "XhoI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "219",
              "start": 1235,
              "end": 2018,
              "type": "CDS",
              "name": "GFPuv",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "220",
              "start": 4513,
              "end": 5173,
              "type": "misc_marker",
              "name": "CmR",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "221",
              "start": 2033,
              "end": 2162,
              "type": "terminator",
              "name": "dbl term",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "222",
              "start": 1123,
              "end": 1162,
              "type": "protein_bind",
              "name": "Operator I2 and I1",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "223",
              "start": 1071,
              "end": 1093,
              "type": "protein_bind",
              "name": "operator O1",
              "strand": 1,
              "__typename": "sequenceFeature"
            }
          ],
          "__typename": "sequence",
          "j5DirectSynthesis": null,
          "j5InputSequence": {
            "id": "6",
            "isStock": true,
            "sequence": {
              "id": "34",
              "name": "pj5_00001",
              "circular": true,
              "description": "",
              "size": 5299,
              "hash": "1e0ac0ee7c31b5855172c24b72fc8b92e63e520012c4221f1d7466014fa5022b",
              "polynucleotideMaterialId": null,
              "isJ5Sequence": true,
              "sequenceParts": [
                {
                  "id": "18",
                  "cid": "1-24096",
                  "name": "GFPuv",
                  "__typename": "sequencePart"
                },
                {
                  "id": "19",
                  "cid": "1-24097",
                  "name": "pS8c-vector_backbone",
                  "__typename": "sequencePart"
                }
              ],
              "sequenceSegments": [
                {
                  "id": "67",
                  "start": 0,
                  "end": 5298,
                  "strand": 1,
                  "sourceSequencePart": null,
                  "__typename": "sequenceSegment"
                }
              ],
              "sequenceFeatures": [
                {
                  "id": "208",
                  "start": 913,
                  "end": 931,
                  "type": "protein_bind",
                  "name": "operator O2",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "209",
                  "start": 4392,
                  "end": 4498,
                  "type": "terminator",
                  "name": "T0",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "210",
                  "start": 2163,
                  "end": 4392,
                  "type": "rep_origin",
                  "name": "pSC101**",
                  "strand": -1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "211",
                  "start": 1952,
                  "end": 2015,
                  "type": "CDS",
                  "name": "signal_peptide",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "212",
                  "start": 1215,
                  "end": 1235,
                  "type": "RBS",
                  "name": "RBS",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "213",
                  "start": 1160,
                  "end": 1188,
                  "type": "promoter",
                  "name": "pBAD promoter",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "214",
                  "start": 1114,
                  "end": 1128,
                  "type": "misc_binding",
                  "name": "CAP site",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "215",
                  "start": 1035,
                  "end": 1064,
                  "type": "promoter",
                  "name": "araC promoter",
                  "strand": -1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "216",
                  "start": 6,
                  "end": 885,
                  "type": "CDS",
                  "name": "araC",
                  "strand": -1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "217",
                  "start": 1759,
                  "end": 1760,
                  "type": "misc_feature",
                  "name": "BamHI_silent_mutation",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "218",
                  "start": 1660,
                  "end": 1661,
                  "type": "misc_feature",
                  "name": "XhoI_silent_mutation",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "219",
                  "start": 1235,
                  "end": 2018,
                  "type": "CDS",
                  "name": "GFPuv",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "220",
                  "start": 4513,
                  "end": 5173,
                  "type": "misc_marker",
                  "name": "CmR",
                  "strand": -1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "221",
                  "start": 2033,
                  "end": 2162,
                  "type": "terminator",
                  "name": "dbl term",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "222",
                  "start": 1123,
                  "end": 1162,
                  "type": "protein_bind",
                  "name": "Operator I2 and I1",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "223",
                  "start": 1071,
                  "end": 1093,
                  "type": "protein_bind",
                  "name": "operator O1",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                }
              ],
              "__typename": "sequence"
            },
            "j5InputParts": [
              {
                "id": "10",
                "sequencePart": {
                  "id": "18",
                  "cid": "1-24096",
                  "name": "GFPuv",
                  "start": 1242,
                  "end": 1952,
                  "strand": 1,
                  "__typename": "sequencePart"
                },
                "__typename": "j5InputPart"
              },
              {
                "id": "11",
                "sequencePart": {
                  "id": "19",
                  "cid": "1-24097",
                  "name": "pS8c-vector_backbone",
                  "start": 2016,
                  "end": 1238,
                  "strand": 1,
                  "__typename": "sequencePart"
                },
                "__typename": "j5InputPart"
              }
            ],
            "__typename": "j5InputSequence"
          }
        },
        "secondaryTemplate": null,
        "forwardPrimer": {
          "id": "15",
          "name": "Oli1_(24607)_(24097)_forward",
          "sequence": {
            "id": "39",
            "name": "Oli1_(24607)_(24097)_forward",
            "circular": null,
            "description": null,
            "size": 57,
            "hash": "65be7c2711963b41a01e9879d0b84af054a33bd44ce6e4a1b9a653289bd14221",
            "polynucleotideMaterialId": null,
            "isJ5Sequence": true,
            "sequenceParts": [],
            "sequenceSegments": [
              {
                "id": "72",
                "start": 0,
                "end": 56,
                "strand": 1,
                "sourceSequencePart": null,
                "__typename": "sequenceSegment"
              }
            ],
            "sequenceFeatures": [],
            "__typename": "sequence"
          },
          "__typename": "j5Oligo"
        },
        "reversePrimer": {
          "id": "16",
          "name": "Oli2_(24097)_(24608)_reverse",
          "sequence": {
            "id": "40",
            "name": "Oli2_(24097)_(24608)_reverse",
            "circular": null,
            "description": null,
            "size": 101,
            "hash": "ee47a7d546d6619cfb818923d761d15c44fef0c5489d8c9eb38932b48e51c3d0",
            "polynucleotideMaterialId": null,
            "isJ5Sequence": true,
            "sequenceParts": [],
            "sequenceSegments": [
              {
                "id": "73",
                "start": 0,
                "end": 100,
                "strand": -1,
                "sourceSequencePart": null,
                "__typename": "sequenceSegment"
              }
            ],
            "sequenceFeatures": [],
            "__typename": "sequence"
          },
          "__typename": "j5Oligo"
        },
        "__typename": "j5PcrReaction"
      },
      {
        "id": "8",
        "note": "PCR",
        "oligoDeltaTm": 11.805,
        "oligoDeltaTm3Prime": 0.855000000000004,
        "oligoMeanTm": 75.2525,
        "oligoMeanTm3Prime": 68.5515,
        "pcrProductSequence": {
          "id": "47",
          "name": "PCR1-1",
          "circular": null,
          "description": null,
          "size": 806,
          "hash": "e4d59b906bf6307625ab0e6be8d0436afec09bef4b7bd0fad8629d0098ed278a",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [],
          "sequenceSegments": [
            {
              "id": "80",
              "start": 0,
              "end": 805,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [],
          "__typename": "sequence"
        },
        "primaryTemplate": {
          "id": "34",
          "name": "pj5_00001",
          "circular": true,
          "description": "",
          "size": 5299,
          "hash": "1e0ac0ee7c31b5855172c24b72fc8b92e63e520012c4221f1d7466014fa5022b",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [
            {
              "id": "18",
              "cid": "1-24096",
              "name": "GFPuv",
              "__typename": "sequencePart"
            },
            {
              "id": "19",
              "cid": "1-24097",
              "name": "pS8c-vector_backbone",
              "__typename": "sequencePart"
            }
          ],
          "sequenceSegments": [
            {
              "id": "67",
              "start": 0,
              "end": 5298,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [
            {
              "id": "208",
              "start": 913,
              "end": 931,
              "type": "protein_bind",
              "name": "operator O2",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "209",
              "start": 4392,
              "end": 4498,
              "type": "terminator",
              "name": "T0",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "210",
              "start": 2163,
              "end": 4392,
              "type": "rep_origin",
              "name": "pSC101**",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "211",
              "start": 1952,
              "end": 2015,
              "type": "CDS",
              "name": "signal_peptide",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "212",
              "start": 1215,
              "end": 1235,
              "type": "RBS",
              "name": "RBS",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "213",
              "start": 1160,
              "end": 1188,
              "type": "promoter",
              "name": "pBAD promoter",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "214",
              "start": 1114,
              "end": 1128,
              "type": "misc_binding",
              "name": "CAP site",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "215",
              "start": 1035,
              "end": 1064,
              "type": "promoter",
              "name": "araC promoter",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "216",
              "start": 6,
              "end": 885,
              "type": "CDS",
              "name": "araC",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "217",
              "start": 1759,
              "end": 1760,
              "type": "misc_feature",
              "name": "BamHI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "218",
              "start": 1660,
              "end": 1661,
              "type": "misc_feature",
              "name": "XhoI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "219",
              "start": 1235,
              "end": 2018,
              "type": "CDS",
              "name": "GFPuv",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "220",
              "start": 4513,
              "end": 5173,
              "type": "misc_marker",
              "name": "CmR",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "221",
              "start": 2033,
              "end": 2162,
              "type": "terminator",
              "name": "dbl term",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "222",
              "start": 1123,
              "end": 1162,
              "type": "protein_bind",
              "name": "Operator I2 and I1",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "223",
              "start": 1071,
              "end": 1093,
              "type": "protein_bind",
              "name": "operator O1",
              "strand": 1,
              "__typename": "sequenceFeature"
            }
          ],
          "__typename": "sequence",
          "j5DirectSynthesis": null,
          "j5InputSequence": {
            "id": "6",
            "isStock": true,
            "sequence": {
              "id": "34",
              "name": "pj5_00001",
              "circular": true,
              "description": "",
              "size": 5299,
              "hash": "1e0ac0ee7c31b5855172c24b72fc8b92e63e520012c4221f1d7466014fa5022b",
              "polynucleotideMaterialId": null,
              "isJ5Sequence": true,
              "sequenceParts": [
                {
                  "id": "18",
                  "cid": "1-24096",
                  "name": "GFPuv",
                  "__typename": "sequencePart"
                },
                {
                  "id": "19",
                  "cid": "1-24097",
                  "name": "pS8c-vector_backbone",
                  "__typename": "sequencePart"
                }
              ],
              "sequenceSegments": [
                {
                  "id": "67",
                  "start": 0,
                  "end": 5298,
                  "strand": 1,
                  "sourceSequencePart": null,
                  "__typename": "sequenceSegment"
                }
              ],
              "sequenceFeatures": [
                {
                  "id": "208",
                  "start": 913,
                  "end": 931,
                  "type": "protein_bind",
                  "name": "operator O2",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "209",
                  "start": 4392,
                  "end": 4498,
                  "type": "terminator",
                  "name": "T0",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "210",
                  "start": 2163,
                  "end": 4392,
                  "type": "rep_origin",
                  "name": "pSC101**",
                  "strand": -1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "211",
                  "start": 1952,
                  "end": 2015,
                  "type": "CDS",
                  "name": "signal_peptide",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "212",
                  "start": 1215,
                  "end": 1235,
                  "type": "RBS",
                  "name": "RBS",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "213",
                  "start": 1160,
                  "end": 1188,
                  "type": "promoter",
                  "name": "pBAD promoter",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "214",
                  "start": 1114,
                  "end": 1128,
                  "type": "misc_binding",
                  "name": "CAP site",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "215",
                  "start": 1035,
                  "end": 1064,
                  "type": "promoter",
                  "name": "araC promoter",
                  "strand": -1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "216",
                  "start": 6,
                  "end": 885,
                  "type": "CDS",
                  "name": "araC",
                  "strand": -1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "217",
                  "start": 1759,
                  "end": 1760,
                  "type": "misc_feature",
                  "name": "BamHI_silent_mutation",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "218",
                  "start": 1660,
                  "end": 1661,
                  "type": "misc_feature",
                  "name": "XhoI_silent_mutation",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "219",
                  "start": 1235,
                  "end": 2018,
                  "type": "CDS",
                  "name": "GFPuv",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "220",
                  "start": 4513,
                  "end": 5173,
                  "type": "misc_marker",
                  "name": "CmR",
                  "strand": -1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "221",
                  "start": 2033,
                  "end": 2162,
                  "type": "terminator",
                  "name": "dbl term",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "222",
                  "start": 1123,
                  "end": 1162,
                  "type": "protein_bind",
                  "name": "Operator I2 and I1",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "223",
                  "start": 1071,
                  "end": 1093,
                  "type": "protein_bind",
                  "name": "operator O1",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                }
              ],
              "__typename": "sequence"
            },
            "j5InputParts": [
              {
                "id": "10",
                "sequencePart": {
                  "id": "18",
                  "cid": "1-24096",
                  "name": "GFPuv",
                  "start": 1242,
                  "end": 1952,
                  "strand": 1,
                  "__typename": "sequencePart"
                },
                "__typename": "j5InputPart"
              },
              {
                "id": "11",
                "sequencePart": {
                  "id": "19",
                  "cid": "1-24097",
                  "name": "pS8c-vector_backbone",
                  "start": 2016,
                  "end": 1238,
                  "strand": 1,
                  "__typename": "sequencePart"
                },
                "__typename": "j5InputPart"
              }
            ],
            "__typename": "j5InputSequence"
          }
        },
        "secondaryTemplate": null,
        "forwardPrimer": {
          "id": "17",
          "name": "Oli3_(24609)_(24096)_forward",
          "sequence": {
            "id": "41",
            "name": "Oli3_(24609)_(24096)_forward",
            "circular": null,
            "description": null,
            "size": 94,
            "hash": "9d6eb933b8524a605d65357f97f1ce55b0a8394e1878f47eec861f5671091a3d",
            "polynucleotideMaterialId": null,
            "isJ5Sequence": true,
            "sequenceParts": [],
            "sequenceSegments": [
              {
                "id": "74",
                "start": 0,
                "end": 93,
                "strand": 1,
                "sourceSequencePart": null,
                "__typename": "sequenceSegment"
              }
            ],
            "sequenceFeatures": [],
            "__typename": "sequence"
          },
          "__typename": "j5Oligo"
        },
        "reversePrimer": {
          "id": "18",
          "name": "Oli4_(24096)_(24606)_reverse",
          "sequence": {
            "id": "42",
            "name": "Oli4_(24096)_(24606)_reverse",
            "circular": null,
            "description": null,
            "size": 51,
            "hash": "1cb3ef3c9ae3e0c28eef6dfeb9b2b24cea8859abf91d23a9125831cf74956dc3",
            "polynucleotideMaterialId": null,
            "isJ5Sequence": true,
            "sequenceParts": [],
            "sequenceSegments": [
              {
                "id": "75",
                "start": 0,
                "end": 50,
                "strand": -1,
                "sourceSequencePart": null,
                "__typename": "sequenceSegment"
              }
            ],
            "sequenceFeatures": [],
            "__typename": "sequence"
          },
          "__typename": "j5Oligo"
        },
        "__typename": "j5PcrReaction"
      },
      {
        "id": "9",
        "note": "PCR",
        "oligoDeltaTm": 11.805,
        "oligoDeltaTm3Prime": 0.855000000000004,
        "oligoMeanTm": 75.2525,
        "oligoMeanTm3Prime": 68.5515,
        "pcrProductSequence": {
          "id": "48",
          "name": "PCR1-2",
          "circular": null,
          "description": null,
          "size": 812,
          "hash": "f1c29c6d8a72aaa7fdbf90c68db14a8c4cb70f394387fae10741da5c88846b8e",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [],
          "sequenceSegments": [
            {
              "id": "81",
              "start": 0,
              "end": 811,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [],
          "__typename": "sequence"
        },
        "primaryTemplate": {
          "id": "34",
          "name": "pj5_00001",
          "circular": true,
          "description": "",
          "size": 5299,
          "hash": "1e0ac0ee7c31b5855172c24b72fc8b92e63e520012c4221f1d7466014fa5022b",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [
            {
              "id": "18",
              "cid": "1-24096",
              "name": "GFPuv",
              "__typename": "sequencePart"
            },
            {
              "id": "19",
              "cid": "1-24097",
              "name": "pS8c-vector_backbone",
              "__typename": "sequencePart"
            }
          ],
          "sequenceSegments": [
            {
              "id": "67",
              "start": 0,
              "end": 5298,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [
            {
              "id": "208",
              "start": 913,
              "end": 931,
              "type": "protein_bind",
              "name": "operator O2",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "209",
              "start": 4392,
              "end": 4498,
              "type": "terminator",
              "name": "T0",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "210",
              "start": 2163,
              "end": 4392,
              "type": "rep_origin",
              "name": "pSC101**",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "211",
              "start": 1952,
              "end": 2015,
              "type": "CDS",
              "name": "signal_peptide",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "212",
              "start": 1215,
              "end": 1235,
              "type": "RBS",
              "name": "RBS",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "213",
              "start": 1160,
              "end": 1188,
              "type": "promoter",
              "name": "pBAD promoter",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "214",
              "start": 1114,
              "end": 1128,
              "type": "misc_binding",
              "name": "CAP site",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "215",
              "start": 1035,
              "end": 1064,
              "type": "promoter",
              "name": "araC promoter",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "216",
              "start": 6,
              "end": 885,
              "type": "CDS",
              "name": "araC",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "217",
              "start": 1759,
              "end": 1760,
              "type": "misc_feature",
              "name": "BamHI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "218",
              "start": 1660,
              "end": 1661,
              "type": "misc_feature",
              "name": "XhoI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "219",
              "start": 1235,
              "end": 2018,
              "type": "CDS",
              "name": "GFPuv",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "220",
              "start": 4513,
              "end": 5173,
              "type": "misc_marker",
              "name": "CmR",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "221",
              "start": 2033,
              "end": 2162,
              "type": "terminator",
              "name": "dbl term",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "222",
              "start": 1123,
              "end": 1162,
              "type": "protein_bind",
              "name": "Operator I2 and I1",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "223",
              "start": 1071,
              "end": 1093,
              "type": "protein_bind",
              "name": "operator O1",
              "strand": 1,
              "__typename": "sequenceFeature"
            }
          ],
          "__typename": "sequence",
          "j5DirectSynthesis": null,
          "j5InputSequence": {
            "id": "6",
            "isStock": true,
            "sequence": {
              "id": "34",
              "name": "pj5_00001",
              "circular": true,
              "description": "",
              "size": 5299,
              "hash": "1e0ac0ee7c31b5855172c24b72fc8b92e63e520012c4221f1d7466014fa5022b",
              "polynucleotideMaterialId": null,
              "isJ5Sequence": true,
              "sequenceParts": [
                {
                  "id": "18",
                  "cid": "1-24096",
                  "name": "GFPuv",
                  "__typename": "sequencePart"
                },
                {
                  "id": "19",
                  "cid": "1-24097",
                  "name": "pS8c-vector_backbone",
                  "__typename": "sequencePart"
                }
              ],
              "sequenceSegments": [
                {
                  "id": "67",
                  "start": 0,
                  "end": 5298,
                  "strand": 1,
                  "sourceSequencePart": null,
                  "__typename": "sequenceSegment"
                }
              ],
              "sequenceFeatures": [
                {
                  "id": "208",
                  "start": 913,
                  "end": 931,
                  "type": "protein_bind",
                  "name": "operator O2",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "209",
                  "start": 4392,
                  "end": 4498,
                  "type": "terminator",
                  "name": "T0",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "210",
                  "start": 2163,
                  "end": 4392,
                  "type": "rep_origin",
                  "name": "pSC101**",
                  "strand": -1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "211",
                  "start": 1952,
                  "end": 2015,
                  "type": "CDS",
                  "name": "signal_peptide",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "212",
                  "start": 1215,
                  "end": 1235,
                  "type": "RBS",
                  "name": "RBS",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "213",
                  "start": 1160,
                  "end": 1188,
                  "type": "promoter",
                  "name": "pBAD promoter",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "214",
                  "start": 1114,
                  "end": 1128,
                  "type": "misc_binding",
                  "name": "CAP site",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "215",
                  "start": 1035,
                  "end": 1064,
                  "type": "promoter",
                  "name": "araC promoter",
                  "strand": -1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "216",
                  "start": 6,
                  "end": 885,
                  "type": "CDS",
                  "name": "araC",
                  "strand": -1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "217",
                  "start": 1759,
                  "end": 1760,
                  "type": "misc_feature",
                  "name": "BamHI_silent_mutation",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "218",
                  "start": 1660,
                  "end": 1661,
                  "type": "misc_feature",
                  "name": "XhoI_silent_mutation",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "219",
                  "start": 1235,
                  "end": 2018,
                  "type": "CDS",
                  "name": "GFPuv",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "220",
                  "start": 4513,
                  "end": 5173,
                  "type": "misc_marker",
                  "name": "CmR",
                  "strand": -1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "221",
                  "start": 2033,
                  "end": 2162,
                  "type": "terminator",
                  "name": "dbl term",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "222",
                  "start": 1123,
                  "end": 1162,
                  "type": "protein_bind",
                  "name": "Operator I2 and I1",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "223",
                  "start": 1071,
                  "end": 1093,
                  "type": "protein_bind",
                  "name": "operator O1",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                }
              ],
              "__typename": "sequence"
            },
            "j5InputParts": [
              {
                "id": "10",
                "sequencePart": {
                  "id": "18",
                  "cid": "1-24096",
                  "name": "GFPuv",
                  "start": 1242,
                  "end": 1952,
                  "strand": 1,
                  "__typename": "sequencePart"
                },
                "__typename": "j5InputPart"
              },
              {
                "id": "11",
                "sequencePart": {
                  "id": "19",
                  "cid": "1-24097",
                  "name": "pS8c-vector_backbone",
                  "start": 2016,
                  "end": 1238,
                  "strand": 1,
                  "__typename": "sequencePart"
                },
                "__typename": "j5InputPart"
              }
            ],
            "__typename": "j5InputSequence"
          }
        },
        "secondaryTemplate": null,
        "forwardPrimer": {
          "id": "17",
          "name": "Oli3_(24609)_(24096)_forward",
          "sequence": {
            "id": "41",
            "name": "Oli3_(24609)_(24096)_forward",
            "circular": null,
            "description": null,
            "size": 94,
            "hash": "9d6eb933b8524a605d65357f97f1ce55b0a8394e1878f47eec861f5671091a3d",
            "polynucleotideMaterialId": null,
            "isJ5Sequence": true,
            "sequenceParts": [],
            "sequenceSegments": [
              {
                "id": "74",
                "start": 0,
                "end": 93,
                "strand": 1,
                "sourceSequencePart": null,
                "__typename": "sequenceSegment"
              }
            ],
            "sequenceFeatures": [],
            "__typename": "sequence"
          },
          "__typename": "j5Oligo"
        },
        "reversePrimer": {
          "id": "19",
          "name": "Oli5_(24096)_(24605)_reverse",
          "sequence": {
            "id": "43",
            "name": "Oli5_(24096)_(24605)_reverse",
            "circular": null,
            "description": null,
            "size": 57,
            "hash": "a99fc78b2e4ca604f56c67992ae6ac4a9b6555c3c977569ac8907e5509183f1b",
            "polynucleotideMaterialId": null,
            "isJ5Sequence": true,
            "sequenceParts": [],
            "sequenceSegments": [
              {
                "id": "76",
                "start": 0,
                "end": 56,
                "strand": -1,
                "sourceSequencePart": null,
                "__typename": "sequenceSegment"
              }
            ],
            "sequenceFeatures": [],
            "__typename": "sequence"
          },
          "__typename": "j5Oligo"
        },
        "__typename": "j5PcrReaction"
      },
      {
        "id": "10",
        "note": "PCR",
        "oligoDeltaTm": 10.455,
        "oligoDeltaTm3Prime": 0.855000000000004,
        "oligoMeanTm": 75.9275,
        "oligoMeanTm3Prime": 68.5515,
        "pcrProductSequence": {
          "id": "49",
          "name": "PCR1-3",
          "circular": null,
          "description": null,
          "size": 782,
          "hash": "1ddba4f3e50211e8f9d188267434c37fb4222d45d2ab85ae58b1c849b92baf2b",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [],
          "sequenceSegments": [
            {
              "id": "82",
              "start": 0,
              "end": 781,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [],
          "__typename": "sequence"
        },
        "primaryTemplate": {
          "id": "34",
          "name": "pj5_00001",
          "circular": true,
          "description": "",
          "size": 5299,
          "hash": "1e0ac0ee7c31b5855172c24b72fc8b92e63e520012c4221f1d7466014fa5022b",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [
            {
              "id": "18",
              "cid": "1-24096",
              "name": "GFPuv",
              "__typename": "sequencePart"
            },
            {
              "id": "19",
              "cid": "1-24097",
              "name": "pS8c-vector_backbone",
              "__typename": "sequencePart"
            }
          ],
          "sequenceSegments": [
            {
              "id": "67",
              "start": 0,
              "end": 5298,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [
            {
              "id": "208",
              "start": 913,
              "end": 931,
              "type": "protein_bind",
              "name": "operator O2",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "209",
              "start": 4392,
              "end": 4498,
              "type": "terminator",
              "name": "T0",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "210",
              "start": 2163,
              "end": 4392,
              "type": "rep_origin",
              "name": "pSC101**",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "211",
              "start": 1952,
              "end": 2015,
              "type": "CDS",
              "name": "signal_peptide",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "212",
              "start": 1215,
              "end": 1235,
              "type": "RBS",
              "name": "RBS",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "213",
              "start": 1160,
              "end": 1188,
              "type": "promoter",
              "name": "pBAD promoter",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "214",
              "start": 1114,
              "end": 1128,
              "type": "misc_binding",
              "name": "CAP site",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "215",
              "start": 1035,
              "end": 1064,
              "type": "promoter",
              "name": "araC promoter",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "216",
              "start": 6,
              "end": 885,
              "type": "CDS",
              "name": "araC",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "217",
              "start": 1759,
              "end": 1760,
              "type": "misc_feature",
              "name": "BamHI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "218",
              "start": 1660,
              "end": 1661,
              "type": "misc_feature",
              "name": "XhoI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "219",
              "start": 1235,
              "end": 2018,
              "type": "CDS",
              "name": "GFPuv",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "220",
              "start": 4513,
              "end": 5173,
              "type": "misc_marker",
              "name": "CmR",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "221",
              "start": 2033,
              "end": 2162,
              "type": "terminator",
              "name": "dbl term",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "222",
              "start": 1123,
              "end": 1162,
              "type": "protein_bind",
              "name": "Operator I2 and I1",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "223",
              "start": 1071,
              "end": 1093,
              "type": "protein_bind",
              "name": "operator O1",
              "strand": 1,
              "__typename": "sequenceFeature"
            }
          ],
          "__typename": "sequence",
          "j5DirectSynthesis": null,
          "j5InputSequence": {
            "id": "6",
            "isStock": true,
            "sequence": {
              "id": "34",
              "name": "pj5_00001",
              "circular": true,
              "description": "",
              "size": 5299,
              "hash": "1e0ac0ee7c31b5855172c24b72fc8b92e63e520012c4221f1d7466014fa5022b",
              "polynucleotideMaterialId": null,
              "isJ5Sequence": true,
              "sequenceParts": [
                {
                  "id": "18",
                  "cid": "1-24096",
                  "name": "GFPuv",
                  "__typename": "sequencePart"
                },
                {
                  "id": "19",
                  "cid": "1-24097",
                  "name": "pS8c-vector_backbone",
                  "__typename": "sequencePart"
                }
              ],
              "sequenceSegments": [
                {
                  "id": "67",
                  "start": 0,
                  "end": 5298,
                  "strand": 1,
                  "sourceSequencePart": null,
                  "__typename": "sequenceSegment"
                }
              ],
              "sequenceFeatures": [
                {
                  "id": "208",
                  "start": 913,
                  "end": 931,
                  "type": "protein_bind",
                  "name": "operator O2",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "209",
                  "start": 4392,
                  "end": 4498,
                  "type": "terminator",
                  "name": "T0",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "210",
                  "start": 2163,
                  "end": 4392,
                  "type": "rep_origin",
                  "name": "pSC101**",
                  "strand": -1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "211",
                  "start": 1952,
                  "end": 2015,
                  "type": "CDS",
                  "name": "signal_peptide",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "212",
                  "start": 1215,
                  "end": 1235,
                  "type": "RBS",
                  "name": "RBS",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "213",
                  "start": 1160,
                  "end": 1188,
                  "type": "promoter",
                  "name": "pBAD promoter",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "214",
                  "start": 1114,
                  "end": 1128,
                  "type": "misc_binding",
                  "name": "CAP site",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "215",
                  "start": 1035,
                  "end": 1064,
                  "type": "promoter",
                  "name": "araC promoter",
                  "strand": -1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "216",
                  "start": 6,
                  "end": 885,
                  "type": "CDS",
                  "name": "araC",
                  "strand": -1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "217",
                  "start": 1759,
                  "end": 1760,
                  "type": "misc_feature",
                  "name": "BamHI_silent_mutation",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "218",
                  "start": 1660,
                  "end": 1661,
                  "type": "misc_feature",
                  "name": "XhoI_silent_mutation",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "219",
                  "start": 1235,
                  "end": 2018,
                  "type": "CDS",
                  "name": "GFPuv",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "220",
                  "start": 4513,
                  "end": 5173,
                  "type": "misc_marker",
                  "name": "CmR",
                  "strand": -1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "221",
                  "start": 2033,
                  "end": 2162,
                  "type": "terminator",
                  "name": "dbl term",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "222",
                  "start": 1123,
                  "end": 1162,
                  "type": "protein_bind",
                  "name": "Operator I2 and I1",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "223",
                  "start": 1071,
                  "end": 1093,
                  "type": "protein_bind",
                  "name": "operator O1",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                }
              ],
              "__typename": "sequence"
            },
            "j5InputParts": [
              {
                "id": "10",
                "sequencePart": {
                  "id": "18",
                  "cid": "1-24096",
                  "name": "GFPuv",
                  "start": 1242,
                  "end": 1952,
                  "strand": 1,
                  "__typename": "sequencePart"
                },
                "__typename": "j5InputPart"
              },
              {
                "id": "11",
                "sequencePart": {
                  "id": "19",
                  "cid": "1-24097",
                  "name": "pS8c-vector_backbone",
                  "start": 2016,
                  "end": 1238,
                  "strand": 1,
                  "__typename": "sequencePart"
                },
                "__typename": "j5InputPart"
              }
            ],
            "__typename": "j5InputSequence"
          }
        },
        "secondaryTemplate": null,
        "forwardPrimer": {
          "id": "20",
          "name": "Oli6_(24611)_(24096)_forward",
          "sequence": {
            "id": "44",
            "name": "Oli6_(24611)_(24096)_forward",
            "circular": null,
            "description": null,
            "size": 70,
            "hash": "cc6c994df18dc1934a49596097d888f326c072c2957da98549d748f3fe98fb4b",
            "polynucleotideMaterialId": null,
            "isJ5Sequence": true,
            "sequenceParts": [],
            "sequenceSegments": [
              {
                "id": "77",
                "start": 0,
                "end": 69,
                "strand": 1,
                "sourceSequencePart": null,
                "__typename": "sequenceSegment"
              }
            ],
            "sequenceFeatures": [],
            "__typename": "sequence"
          },
          "__typename": "j5Oligo"
        },
        "reversePrimer": {
          "id": "18",
          "name": "Oli4_(24096)_(24606)_reverse",
          "sequence": {
            "id": "42",
            "name": "Oli4_(24096)_(24606)_reverse",
            "circular": null,
            "description": null,
            "size": 51,
            "hash": "1cb3ef3c9ae3e0c28eef6dfeb9b2b24cea8859abf91d23a9125831cf74956dc3",
            "polynucleotideMaterialId": null,
            "isJ5Sequence": true,
            "sequenceParts": [],
            "sequenceSegments": [
              {
                "id": "75",
                "start": 0,
                "end": 50,
                "strand": -1,
                "sourceSequencePart": null,
                "__typename": "sequenceSegment"
              }
            ],
            "sequenceFeatures": [],
            "__typename": "sequence"
          },
          "__typename": "j5Oligo"
        },
        "__typename": "j5PcrReaction"
      },
      {
        "id": "11",
        "note": "PCR",
        "oligoDeltaTm": 10.455,
        "oligoDeltaTm3Prime": 0.855000000000004,
        "oligoMeanTm": 75.9275,
        "oligoMeanTm3Prime": 68.5515,
        "pcrProductSequence": {
          "id": "50",
          "name": "PCR1-4",
          "circular": null,
          "description": null,
          "size": 788,
          "hash": "0891859169f4df8b8726df64429e21cb6c5b4e907ed95c5b4ff3c01aad031431",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [],
          "sequenceSegments": [
            {
              "id": "83",
              "start": 0,
              "end": 787,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [],
          "__typename": "sequence"
        },
        "primaryTemplate": {
          "id": "34",
          "name": "pj5_00001",
          "circular": true,
          "description": "",
          "size": 5299,
          "hash": "1e0ac0ee7c31b5855172c24b72fc8b92e63e520012c4221f1d7466014fa5022b",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [
            {
              "id": "18",
              "cid": "1-24096",
              "name": "GFPuv",
              "__typename": "sequencePart"
            },
            {
              "id": "19",
              "cid": "1-24097",
              "name": "pS8c-vector_backbone",
              "__typename": "sequencePart"
            }
          ],
          "sequenceSegments": [
            {
              "id": "67",
              "start": 0,
              "end": 5298,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [
            {
              "id": "208",
              "start": 913,
              "end": 931,
              "type": "protein_bind",
              "name": "operator O2",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "209",
              "start": 4392,
              "end": 4498,
              "type": "terminator",
              "name": "T0",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "210",
              "start": 2163,
              "end": 4392,
              "type": "rep_origin",
              "name": "pSC101**",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "211",
              "start": 1952,
              "end": 2015,
              "type": "CDS",
              "name": "signal_peptide",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "212",
              "start": 1215,
              "end": 1235,
              "type": "RBS",
              "name": "RBS",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "213",
              "start": 1160,
              "end": 1188,
              "type": "promoter",
              "name": "pBAD promoter",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "214",
              "start": 1114,
              "end": 1128,
              "type": "misc_binding",
              "name": "CAP site",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "215",
              "start": 1035,
              "end": 1064,
              "type": "promoter",
              "name": "araC promoter",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "216",
              "start": 6,
              "end": 885,
              "type": "CDS",
              "name": "araC",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "217",
              "start": 1759,
              "end": 1760,
              "type": "misc_feature",
              "name": "BamHI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "218",
              "start": 1660,
              "end": 1661,
              "type": "misc_feature",
              "name": "XhoI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "219",
              "start": 1235,
              "end": 2018,
              "type": "CDS",
              "name": "GFPuv",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "220",
              "start": 4513,
              "end": 5173,
              "type": "misc_marker",
              "name": "CmR",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "221",
              "start": 2033,
              "end": 2162,
              "type": "terminator",
              "name": "dbl term",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "222",
              "start": 1123,
              "end": 1162,
              "type": "protein_bind",
              "name": "Operator I2 and I1",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "223",
              "start": 1071,
              "end": 1093,
              "type": "protein_bind",
              "name": "operator O1",
              "strand": 1,
              "__typename": "sequenceFeature"
            }
          ],
          "__typename": "sequence",
          "j5DirectSynthesis": null,
          "j5InputSequence": {
            "id": "6",
            "isStock": true,
            "sequence": {
              "id": "34",
              "name": "pj5_00001",
              "circular": true,
              "description": "",
              "size": 5299,
              "hash": "1e0ac0ee7c31b5855172c24b72fc8b92e63e520012c4221f1d7466014fa5022b",
              "polynucleotideMaterialId": null,
              "isJ5Sequence": true,
              "sequenceParts": [
                {
                  "id": "18",
                  "cid": "1-24096",
                  "name": "GFPuv",
                  "__typename": "sequencePart"
                },
                {
                  "id": "19",
                  "cid": "1-24097",
                  "name": "pS8c-vector_backbone",
                  "__typename": "sequencePart"
                }
              ],
              "sequenceSegments": [
                {
                  "id": "67",
                  "start": 0,
                  "end": 5298,
                  "strand": 1,
                  "sourceSequencePart": null,
                  "__typename": "sequenceSegment"
                }
              ],
              "sequenceFeatures": [
                {
                  "id": "208",
                  "start": 913,
                  "end": 931,
                  "type": "protein_bind",
                  "name": "operator O2",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "209",
                  "start": 4392,
                  "end": 4498,
                  "type": "terminator",
                  "name": "T0",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "210",
                  "start": 2163,
                  "end": 4392,
                  "type": "rep_origin",
                  "name": "pSC101**",
                  "strand": -1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "211",
                  "start": 1952,
                  "end": 2015,
                  "type": "CDS",
                  "name": "signal_peptide",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "212",
                  "start": 1215,
                  "end": 1235,
                  "type": "RBS",
                  "name": "RBS",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "213",
                  "start": 1160,
                  "end": 1188,
                  "type": "promoter",
                  "name": "pBAD promoter",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "214",
                  "start": 1114,
                  "end": 1128,
                  "type": "misc_binding",
                  "name": "CAP site",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "215",
                  "start": 1035,
                  "end": 1064,
                  "type": "promoter",
                  "name": "araC promoter",
                  "strand": -1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "216",
                  "start": 6,
                  "end": 885,
                  "type": "CDS",
                  "name": "araC",
                  "strand": -1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "217",
                  "start": 1759,
                  "end": 1760,
                  "type": "misc_feature",
                  "name": "BamHI_silent_mutation",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "218",
                  "start": 1660,
                  "end": 1661,
                  "type": "misc_feature",
                  "name": "XhoI_silent_mutation",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "219",
                  "start": 1235,
                  "end": 2018,
                  "type": "CDS",
                  "name": "GFPuv",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "220",
                  "start": 4513,
                  "end": 5173,
                  "type": "misc_marker",
                  "name": "CmR",
                  "strand": -1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "221",
                  "start": 2033,
                  "end": 2162,
                  "type": "terminator",
                  "name": "dbl term",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "222",
                  "start": 1123,
                  "end": 1162,
                  "type": "protein_bind",
                  "name": "Operator I2 and I1",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "223",
                  "start": 1071,
                  "end": 1093,
                  "type": "protein_bind",
                  "name": "operator O1",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                }
              ],
              "__typename": "sequence"
            },
            "j5InputParts": [
              {
                "id": "10",
                "sequencePart": {
                  "id": "18",
                  "cid": "1-24096",
                  "name": "GFPuv",
                  "start": 1242,
                  "end": 1952,
                  "strand": 1,
                  "__typename": "sequencePart"
                },
                "__typename": "j5InputPart"
              },
              {
                "id": "11",
                "sequencePart": {
                  "id": "19",
                  "cid": "1-24097",
                  "name": "pS8c-vector_backbone",
                  "start": 2016,
                  "end": 1238,
                  "strand": 1,
                  "__typename": "sequencePart"
                },
                "__typename": "j5InputPart"
              }
            ],
            "__typename": "j5InputSequence"
          }
        },
        "secondaryTemplate": null,
        "forwardPrimer": {
          "id": "20",
          "name": "Oli6_(24611)_(24096)_forward",
          "sequence": {
            "id": "44",
            "name": "Oli6_(24611)_(24096)_forward",
            "circular": null,
            "description": null,
            "size": 70,
            "hash": "cc6c994df18dc1934a49596097d888f326c072c2957da98549d748f3fe98fb4b",
            "polynucleotideMaterialId": null,
            "isJ5Sequence": true,
            "sequenceParts": [],
            "sequenceSegments": [
              {
                "id": "77",
                "start": 0,
                "end": 69,
                "strand": 1,
                "sourceSequencePart": null,
                "__typename": "sequenceSegment"
              }
            ],
            "sequenceFeatures": [],
            "__typename": "sequence"
          },
          "__typename": "j5Oligo"
        },
        "reversePrimer": {
          "id": "19",
          "name": "Oli5_(24096)_(24605)_reverse",
          "sequence": {
            "id": "43",
            "name": "Oli5_(24096)_(24605)_reverse",
            "circular": null,
            "description": null,
            "size": 57,
            "hash": "a99fc78b2e4ca604f56c67992ae6ac4a9b6555c3c977569ac8907e5509183f1b",
            "polynucleotideMaterialId": null,
            "isJ5Sequence": true,
            "sequenceParts": [],
            "sequenceSegments": [
              {
                "id": "76",
                "start": 0,
                "end": 56,
                "strand": -1,
                "sourceSequencePart": null,
                "__typename": "sequenceSegment"
              }
            ],
            "sequenceFeatures": [],
            "__typename": "sequence"
          },
          "__typename": "j5Oligo"
        },
        "__typename": "j5PcrReaction"
      },
      {
        "id": "12",
        "note": "PCR",
        "oligoDeltaTm": 13.57,
        "oligoDeltaTm3Prime": 2.869,
        "oligoMeanTm": 70.166,
        "oligoMeanTm3Prime": 61.6195,
        "pcrProductSequence": {
          "id": "51",
          "name": "PCR1-5",
          "circular": null,
          "description": null,
          "size": 4629,
          "hash": "16b8dde7975374a940f75356a00802d81cac1827f20d3ac8393117c556533576",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [],
          "sequenceSegments": [
            {
              "id": "84",
              "start": 0,
              "end": 4628,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [],
          "__typename": "sequence"
        },
        "primaryTemplate": {
          "id": "34",
          "name": "pj5_00001",
          "circular": true,
          "description": "",
          "size": 5299,
          "hash": "1e0ac0ee7c31b5855172c24b72fc8b92e63e520012c4221f1d7466014fa5022b",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [
            {
              "id": "18",
              "cid": "1-24096",
              "name": "GFPuv",
              "__typename": "sequencePart"
            },
            {
              "id": "19",
              "cid": "1-24097",
              "name": "pS8c-vector_backbone",
              "__typename": "sequencePart"
            }
          ],
          "sequenceSegments": [
            {
              "id": "67",
              "start": 0,
              "end": 5298,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [
            {
              "id": "208",
              "start": 913,
              "end": 931,
              "type": "protein_bind",
              "name": "operator O2",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "209",
              "start": 4392,
              "end": 4498,
              "type": "terminator",
              "name": "T0",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "210",
              "start": 2163,
              "end": 4392,
              "type": "rep_origin",
              "name": "pSC101**",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "211",
              "start": 1952,
              "end": 2015,
              "type": "CDS",
              "name": "signal_peptide",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "212",
              "start": 1215,
              "end": 1235,
              "type": "RBS",
              "name": "RBS",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "213",
              "start": 1160,
              "end": 1188,
              "type": "promoter",
              "name": "pBAD promoter",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "214",
              "start": 1114,
              "end": 1128,
              "type": "misc_binding",
              "name": "CAP site",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "215",
              "start": 1035,
              "end": 1064,
              "type": "promoter",
              "name": "araC promoter",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "216",
              "start": 6,
              "end": 885,
              "type": "CDS",
              "name": "araC",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "217",
              "start": 1759,
              "end": 1760,
              "type": "misc_feature",
              "name": "BamHI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "218",
              "start": 1660,
              "end": 1661,
              "type": "misc_feature",
              "name": "XhoI_silent_mutation",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "219",
              "start": 1235,
              "end": 2018,
              "type": "CDS",
              "name": "GFPuv",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "220",
              "start": 4513,
              "end": 5173,
              "type": "misc_marker",
              "name": "CmR",
              "strand": -1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "221",
              "start": 2033,
              "end": 2162,
              "type": "terminator",
              "name": "dbl term",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "222",
              "start": 1123,
              "end": 1162,
              "type": "protein_bind",
              "name": "Operator I2 and I1",
              "strand": 1,
              "__typename": "sequenceFeature"
            },
            {
              "id": "223",
              "start": 1071,
              "end": 1093,
              "type": "protein_bind",
              "name": "operator O1",
              "strand": 1,
              "__typename": "sequenceFeature"
            }
          ],
          "__typename": "sequence",
          "j5DirectSynthesis": null,
          "j5InputSequence": {
            "id": "6",
            "isStock": true,
            "sequence": {
              "id": "34",
              "name": "pj5_00001",
              "circular": true,
              "description": "",
              "size": 5299,
              "hash": "1e0ac0ee7c31b5855172c24b72fc8b92e63e520012c4221f1d7466014fa5022b",
              "polynucleotideMaterialId": null,
              "isJ5Sequence": true,
              "sequenceParts": [
                {
                  "id": "18",
                  "cid": "1-24096",
                  "name": "GFPuv",
                  "__typename": "sequencePart"
                },
                {
                  "id": "19",
                  "cid": "1-24097",
                  "name": "pS8c-vector_backbone",
                  "__typename": "sequencePart"
                }
              ],
              "sequenceSegments": [
                {
                  "id": "67",
                  "start": 0,
                  "end": 5298,
                  "strand": 1,
                  "sourceSequencePart": null,
                  "__typename": "sequenceSegment"
                }
              ],
              "sequenceFeatures": [
                {
                  "id": "208",
                  "start": 913,
                  "end": 931,
                  "type": "protein_bind",
                  "name": "operator O2",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "209",
                  "start": 4392,
                  "end": 4498,
                  "type": "terminator",
                  "name": "T0",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "210",
                  "start": 2163,
                  "end": 4392,
                  "type": "rep_origin",
                  "name": "pSC101**",
                  "strand": -1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "211",
                  "start": 1952,
                  "end": 2015,
                  "type": "CDS",
                  "name": "signal_peptide",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "212",
                  "start": 1215,
                  "end": 1235,
                  "type": "RBS",
                  "name": "RBS",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "213",
                  "start": 1160,
                  "end": 1188,
                  "type": "promoter",
                  "name": "pBAD promoter",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "214",
                  "start": 1114,
                  "end": 1128,
                  "type": "misc_binding",
                  "name": "CAP site",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "215",
                  "start": 1035,
                  "end": 1064,
                  "type": "promoter",
                  "name": "araC promoter",
                  "strand": -1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "216",
                  "start": 6,
                  "end": 885,
                  "type": "CDS",
                  "name": "araC",
                  "strand": -1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "217",
                  "start": 1759,
                  "end": 1760,
                  "type": "misc_feature",
                  "name": "BamHI_silent_mutation",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "218",
                  "start": 1660,
                  "end": 1661,
                  "type": "misc_feature",
                  "name": "XhoI_silent_mutation",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "219",
                  "start": 1235,
                  "end": 2018,
                  "type": "CDS",
                  "name": "GFPuv",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "220",
                  "start": 4513,
                  "end": 5173,
                  "type": "misc_marker",
                  "name": "CmR",
                  "strand": -1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "221",
                  "start": 2033,
                  "end": 2162,
                  "type": "terminator",
                  "name": "dbl term",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "222",
                  "start": 1123,
                  "end": 1162,
                  "type": "protein_bind",
                  "name": "Operator I2 and I1",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                },
                {
                  "id": "223",
                  "start": 1071,
                  "end": 1093,
                  "type": "protein_bind",
                  "name": "operator O1",
                  "strand": 1,
                  "__typename": "sequenceFeature"
                }
              ],
              "__typename": "sequence"
            },
            "j5InputParts": [
              {
                "id": "10",
                "sequencePart": {
                  "id": "18",
                  "cid": "1-24096",
                  "name": "GFPuv",
                  "start": 1242,
                  "end": 1952,
                  "strand": 1,
                  "__typename": "sequencePart"
                },
                "__typename": "j5InputPart"
              },
              {
                "id": "11",
                "sequencePart": {
                  "id": "19",
                  "cid": "1-24097",
                  "name": "pS8c-vector_backbone",
                  "start": 2016,
                  "end": 1238,
                  "strand": 1,
                  "__typename": "sequencePart"
                },
                "__typename": "j5InputPart"
              }
            ],
            "__typename": "j5InputSequence"
          }
        },
        "secondaryTemplate": null,
        "forwardPrimer": {
          "id": "15",
          "name": "Oli1_(24607)_(24097)_forward",
          "sequence": {
            "id": "39",
            "name": "Oli1_(24607)_(24097)_forward",
            "circular": null,
            "description": null,
            "size": 57,
            "hash": "65be7c2711963b41a01e9879d0b84af054a33bd44ce6e4a1b9a653289bd14221",
            "polynucleotideMaterialId": null,
            "isJ5Sequence": true,
            "sequenceParts": [],
            "sequenceSegments": [
              {
                "id": "72",
                "start": 0,
                "end": 56,
                "strand": 1,
                "sourceSequencePart": null,
                "__typename": "sequenceSegment"
              }
            ],
            "sequenceFeatures": [],
            "__typename": "sequence"
          },
          "__typename": "j5Oligo"
        },
        "reversePrimer": {
          "id": "21",
          "name": "Oli7_(24097)_(24610)_reverse",
          "sequence": {
            "id": "45",
            "name": "Oli7_(24097)_(24610)_reverse",
            "circular": null,
            "description": null,
            "size": 107,
            "hash": "f43f1f244987fd072dd1bb2c20cae2116dea15e009d2990625b4bc561cf2d9f8",
            "polynucleotideMaterialId": null,
            "isJ5Sequence": true,
            "sequenceParts": [],
            "sequenceSegments": [
              {
                "id": "78",
                "start": 0,
                "end": 106,
                "strand": -1,
                "sourceSequencePart": null,
                "__typename": "sequenceSegment"
              }
            ],
            "sequenceFeatures": [],
            "__typename": "sequence"
          },
          "__typename": "j5Oligo"
        },
        "__typename": "j5PcrReaction"
      }
    ],
    "j5OligoSyntheses": [
      {
        "id": "8",
        "cost": 5.7,
        "name": "Oli1_(24607)_(24097)_forward",
        "simpleName": "Oligo 1 Forward",
        "tm": 76.951,
        "tm3Prime": 63.054,
        "oligo": {
          "id": "15",
          "name": "Oli1_(24607)_(24097)_forward",
          "sequence": {
            "id": "39",
            "name": "Oli1_(24607)_(24097)_forward",
            "circular": null,
            "description": null,
            "size": 57,
            "hash": "65be7c2711963b41a01e9879d0b84af054a33bd44ce6e4a1b9a653289bd14221",
            "polynucleotideMaterialId": null,
            "isJ5Sequence": true,
            "sequenceParts": [],
            "sequenceSegments": [
              {
                "id": "72",
                "start": 0,
                "end": 56,
                "strand": 1,
                "sourceSequencePart": null,
                "__typename": "sequenceSegment"
              }
            ],
            "sequenceFeatures": [],
            "__typename": "sequence"
          },
          "__typename": "j5Oligo"
        },
        "__typename": "j5OligoSynthesis"
      },
      {
        "id": "9",
        "cost": 50.1,
        "name": "Oli2_(24097)_(24608)_reverse",
        "simpleName": "Oligo 2 Reverse",
        "tm": 63.154,
        "tm3Prime": 60.185,
        "oligo": {
          "id": "16",
          "name": "Oli2_(24097)_(24608)_reverse",
          "sequence": {
            "id": "40",
            "name": "Oli2_(24097)_(24608)_reverse",
            "circular": null,
            "description": null,
            "size": 101,
            "hash": "ee47a7d546d6619cfb818923d761d15c44fef0c5489d8c9eb38932b48e51c3d0",
            "polynucleotideMaterialId": null,
            "isJ5Sequence": true,
            "sequenceParts": [],
            "sequenceSegments": [
              {
                "id": "73",
                "start": 0,
                "end": 100,
                "strand": -1,
                "sourceSequencePart": null,
                "__typename": "sequenceSegment"
              }
            ],
            "sequenceFeatures": [],
            "__typename": "sequence"
          },
          "__typename": "j5Oligo"
        },
        "__typename": "j5OligoSynthesis"
      },
      {
        "id": "10",
        "cost": 49.4,
        "name": "Oli3_(24609)_(24096)_forward",
        "simpleName": "Oligo 3 Forward",
        "tm": 69.35,
        "tm3Prime": 68.124,
        "oligo": {
          "id": "17",
          "name": "Oli3_(24609)_(24096)_forward",
          "sequence": {
            "id": "41",
            "name": "Oli3_(24609)_(24096)_forward",
            "circular": null,
            "description": null,
            "size": 94,
            "hash": "9d6eb933b8524a605d65357f97f1ce55b0a8394e1878f47eec861f5671091a3d",
            "polynucleotideMaterialId": null,
            "isJ5Sequence": true,
            "sequenceParts": [],
            "sequenceSegments": [
              {
                "id": "74",
                "start": 0,
                "end": 93,
                "strand": 1,
                "sourceSequencePart": null,
                "__typename": "sequenceSegment"
              }
            ],
            "sequenceFeatures": [],
            "__typename": "sequence"
          },
          "__typename": "j5Oligo"
        },
        "__typename": "j5OligoSynthesis"
      },
      {
        "id": "11",
        "cost": 5.1,
        "name": "Oli4_(24096)_(24606)_reverse",
        "simpleName": "Oligo 4 Reverse",
        "tm": 81.155,
        "tm3Prime": 68.979,
        "oligo": {
          "id": "18",
          "name": "Oli4_(24096)_(24606)_reverse",
          "sequence": {
            "id": "42",
            "name": "Oli4_(24096)_(24606)_reverse",
            "circular": null,
            "description": null,
            "size": 51,
            "hash": "1cb3ef3c9ae3e0c28eef6dfeb9b2b24cea8859abf91d23a9125831cf74956dc3",
            "polynucleotideMaterialId": null,
            "isJ5Sequence": true,
            "sequenceParts": [],
            "sequenceSegments": [
              {
                "id": "75",
                "start": 0,
                "end": 50,
                "strand": -1,
                "sourceSequencePart": null,
                "__typename": "sequenceSegment"
              }
            ],
            "sequenceFeatures": [],
            "__typename": "sequence"
          },
          "__typename": "j5Oligo"
        },
        "__typename": "j5OligoSynthesis"
      },
      {
        "id": "12",
        "cost": 5.7,
        "name": "Oli5_(24096)_(24605)_reverse",
        "simpleName": "Oligo 5 Reverse",
        "tm": 81.155,
        "tm3Prime": 68.979,
        "oligo": {
          "id": "19",
          "name": "Oli5_(24096)_(24605)_reverse",
          "sequence": {
            "id": "43",
            "name": "Oli5_(24096)_(24605)_reverse",
            "circular": null,
            "description": null,
            "size": 57,
            "hash": "a99fc78b2e4ca604f56c67992ae6ac4a9b6555c3c977569ac8907e5509183f1b",
            "polynucleotideMaterialId": null,
            "isJ5Sequence": true,
            "sequenceParts": [],
            "sequenceSegments": [
              {
                "id": "76",
                "start": 0,
                "end": 56,
                "strand": -1,
                "sourceSequencePart": null,
                "__typename": "sequenceSegment"
              }
            ],
            "sequenceFeatures": [],
            "__typename": "sequence"
          },
          "__typename": "j5Oligo"
        },
        "__typename": "j5OligoSynthesis"
      },
      {
        "id": "13",
        "cost": 47,
        "name": "Oli6_(24611)_(24096)_forward",
        "simpleName": "Oligo 6 Forward",
        "tm": 70.7,
        "tm3Prime": 68.124,
        "oligo": {
          "id": "20",
          "name": "Oli6_(24611)_(24096)_forward",
          "sequence": {
            "id": "44",
            "name": "Oli6_(24611)_(24096)_forward",
            "circular": null,
            "description": null,
            "size": 70,
            "hash": "cc6c994df18dc1934a49596097d888f326c072c2957da98549d748f3fe98fb4b",
            "polynucleotideMaterialId": null,
            "isJ5Sequence": true,
            "sequenceParts": [],
            "sequenceSegments": [
              {
                "id": "77",
                "start": 0,
                "end": 69,
                "strand": 1,
                "sourceSequencePart": null,
                "__typename": "sequenceSegment"
              }
            ],
            "sequenceFeatures": [],
            "__typename": "sequence"
          },
          "__typename": "j5Oligo"
        },
        "__typename": "j5OligoSynthesis"
      },
      {
        "id": "14",
        "cost": 50.7,
        "name": "Oli7_(24097)_(24610)_reverse",
        "simpleName": "Oligo 7 Reverse",
        "tm": 63.381,
        "tm3Prime": 60.185,
        "oligo": {
          "id": "21",
          "name": "Oli7_(24097)_(24610)_reverse",
          "sequence": {
            "id": "45",
            "name": "Oli7_(24097)_(24610)_reverse",
            "circular": null,
            "description": null,
            "size": 107,
            "hash": "f43f1f244987fd072dd1bb2c20cae2116dea15e009d2990625b4bc561cf2d9f8",
            "polynucleotideMaterialId": null,
            "isJ5Sequence": true,
            "sequenceParts": [],
            "sequenceSegments": [
              {
                "id": "78",
                "start": 0,
                "end": 106,
                "strand": -1,
                "sourceSequencePart": null,
                "__typename": "sequenceSegment"
              }
            ],
            "sequenceFeatures": [],
            "__typename": "sequence"
          },
          "__typename": "j5Oligo"
        },
        "__typename": "j5OligoSynthesis"
      }
    ],
    "j5AnnealedOligos": [],
    "j5AssemblyPieces": [
      {
        "id": "7",
        "name": "AP1-0",
        "type": "PCR",
        "sequence": {
          "id": "46",
          "name": "PCR1-0",
          "circular": null,
          "description": null,
          "size": 4623,
          "hash": "fb9911fb5b38343d5765987778fb819cb8c112d32a283468e15eafa5ab6f7673",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [],
          "sequenceSegments": [
            {
              "id": "79",
              "start": 0,
              "end": 4622,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [],
          "__typename": "sequence"
        },
        "__typename": "j5AssemblyPiece"
      },
      {
        "id": "8",
        "name": "AP1-1",
        "type": "PCR",
        "sequence": {
          "id": "47",
          "name": "PCR1-1",
          "circular": null,
          "description": null,
          "size": 806,
          "hash": "e4d59b906bf6307625ab0e6be8d0436afec09bef4b7bd0fad8629d0098ed278a",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [],
          "sequenceSegments": [
            {
              "id": "80",
              "start": 0,
              "end": 805,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [],
          "__typename": "sequence"
        },
        "__typename": "j5AssemblyPiece"
      },
      {
        "id": "9",
        "name": "AP1-2",
        "type": "PCR",
        "sequence": {
          "id": "48",
          "name": "PCR1-2",
          "circular": null,
          "description": null,
          "size": 812,
          "hash": "f1c29c6d8a72aaa7fdbf90c68db14a8c4cb70f394387fae10741da5c88846b8e",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [],
          "sequenceSegments": [
            {
              "id": "81",
              "start": 0,
              "end": 811,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [],
          "__typename": "sequence"
        },
        "__typename": "j5AssemblyPiece"
      },
      {
        "id": "10",
        "name": "AP1-3",
        "type": "PCR",
        "sequence": {
          "id": "49",
          "name": "PCR1-3",
          "circular": null,
          "description": null,
          "size": 782,
          "hash": "1ddba4f3e50211e8f9d188267434c37fb4222d45d2ab85ae58b1c849b92baf2b",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [],
          "sequenceSegments": [
            {
              "id": "82",
              "start": 0,
              "end": 781,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [],
          "__typename": "sequence"
        },
        "__typename": "j5AssemblyPiece"
      },
      {
        "id": "11",
        "name": "AP1-4",
        "type": "PCR",
        "sequence": {
          "id": "50",
          "name": "PCR1-4",
          "circular": null,
          "description": null,
          "size": 788,
          "hash": "0891859169f4df8b8726df64429e21cb6c5b4e907ed95c5b4ff3c01aad031431",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [],
          "sequenceSegments": [
            {
              "id": "83",
              "start": 0,
              "end": 787,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [],
          "__typename": "sequence"
        },
        "__typename": "j5AssemblyPiece"
      },
      {
        "id": "12",
        "name": "AP1-5",
        "type": "PCR",
        "sequence": {
          "id": "51",
          "name": "PCR1-5",
          "circular": null,
          "description": null,
          "size": 4629,
          "hash": "16b8dde7975374a940f75356a00802d81cac1827f20d3ac8393117c556533576",
          "polynucleotideMaterialId": null,
          "isJ5Sequence": true,
          "sequenceParts": [],
          "sequenceSegments": [
            {
              "id": "84",
              "start": 0,
              "end": 4628,
              "strand": 1,
              "sourceSequencePart": null,
              "__typename": "sequenceSegment"
            }
          ],
          "sequenceFeatures": [],
          "__typename": "sequence"
        },
        "__typename": "j5AssemblyPiece"
      }
    ],
    "j5DirectSyntheses": [],
    "__typename": "j5Report"
  }
}