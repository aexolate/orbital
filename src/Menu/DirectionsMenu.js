import React from 'react';
import { View, Text, Alert } from 'react-native';
import { TextInput, Button, Divider, ActivityIndicator } from 'react-native-paper';
import MapView from 'react-native-maps';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { decode } from '@mapbox/polyline';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import * as Location from 'expo-location';

const DirectionsMenu = ({ navigation }) => {
  //https://maps.googleapis.com/maps/api/directions/json?origin=670507&destination=NUS&mode=driving&altnernatives=true&key=YOUR_API_KEY

  const [originText, setOriginText] = React.useState('');
  const [destinationText, setDestinationText] = React.useState('');
  const [coords, setCoords] = React.useState([]);
  const [markers, setMarkers] = React.useState([]);

  const searchDirections = (start, end) => {
    const resJson = {
      geocoded_waypoints: [
        {
          geocoder_status: 'OK',
          place_id: 'ChIJ-RCSFZkR2jERTKuZhhrNu30',
          types: ['postal_code'],
        },
        {
          geocoder_status: 'OK',
          place_id: 'ChIJw3l-FL4X2jERw2pScvHQCbg',
          types: [
            'airport',
            'establishment',
            'point_of_interest',
            'shopping_mall',
            'tourist_attraction',
          ],
        },
      ],
      routes: [
        {
          bounds: {
            northeast: {
              lat: 1.3893843,
              lng: 103.9874175,
            },
            southwest: {
              lat: 1.291232,
              lng: 103.7674797,
            },
          },
          copyrights: 'Map data ©2022 Google',
          legs: [
            {
              arrival_time: {
                text: '06:27',
                time_zone: 'Asia/Singapore',
                value: 1655591239,
              },
              departure_time: {
                text: '04:12',
                time_zone: 'Asia/Singapore',
                value: 1655583177,
              },
              distance: {
                text: '39.1 km',
                value: 39095,
              },
              duration: {
                text: '2 hours 14 mins',
                value: 8062,
              },
              end_address: '78 Airport Blvd., Jewel Changi Airport, Singapore 819666',
              end_location: {
                lat: 1.3504076,
                lng: 103.9849413,
              },
              start_address: 'Singapore 670507',
              start_location: {
                lat: 1.3864285,
                lng: 103.7679292,
              },
              steps: [
                {
                  distance: {
                    text: '0.2 km',
                    value: 244,
                  },
                  duration: {
                    text: '3 mins',
                    value: 183,
                  },
                  end_location: {
                    lat: 1.3871353,
                    lng: 103.7675511,
                  },
                  html_instructions: 'Walk to Blk 516',
                  polyline: {
                    points: 'exmGqdjxR_@v@EJEHOJQESIiAa@s@WILHJ@@FBHBb@LXH',
                  },
                  start_location: {
                    lat: 1.3864285,
                    lng: 103.7679292,
                  },
                  steps: [
                    {
                      distance: {
                        text: '53 m',
                        value: 53,
                      },
                      duration: {
                        text: '1 min',
                        value: 39,
                      },
                      end_location: {
                        lat: 1.3867286,
                        lng: 103.7674797,
                      },
                      html_instructions:
                        'Walk \u003cb\u003enorth-west\u003c/b\u003e towards \u003cb\u003eJelapang Rd\u003c/b\u003e',
                      polyline: {
                        points: 'exmGqdjxR_@v@EJEHOJ',
                      },
                      start_location: {
                        lat: 1.3864285,
                        lng: 103.7679292,
                      },
                      travel_mode: 'WALKING',
                    },
                    {
                      distance: {
                        text: '0.1 km',
                        value: 111,
                      },
                      duration: {
                        text: '1 min',
                        value: 85,
                      },
                      end_location: {
                        lat: 1.3875451,
                        lng: 103.7678534,
                      },
                      html_instructions:
                        'Turn \u003cb\u003eright\u003c/b\u003e onto \u003cb\u003eJelapang Rd\u003c/b\u003e',
                      maneuver: 'turn-right',
                      polyline: {
                        points: 'azmGwajxRQESIiAa@s@W',
                      },
                      start_location: {
                        lat: 1.3867286,
                        lng: 103.7674797,
                      },
                      travel_mode: 'WALKING',
                    },
                    {
                      distance: {
                        text: '18 m',
                        value: 18,
                      },
                      duration: {
                        text: '1 min',
                        value: 13,
                      },
                      end_location: {
                        lat: 1.3875952,
                        lng: 103.7677761,
                      },
                      html_instructions: 'Turn \u003cb\u003eleft\u003c/b\u003e',
                      maneuver: 'turn-left',
                      polyline: {
                        points: 'e_nGadjxRIL',
                      },
                      start_location: {
                        lat: 1.3875451,
                        lng: 103.7678534,
                      },
                      travel_mode: 'WALKING',
                    },
                    {
                      distance: {
                        text: '62 m',
                        value: 62,
                      },
                      duration: {
                        text: '1 min',
                        value: 46,
                      },
                      end_location: {
                        lat: 1.3871353,
                        lng: 103.7675511,
                      },
                      html_instructions:
                        'Turn \u003cb\u003eleft\u003c/b\u003e\u003cdiv style="font-size:0.9em"\u003eDestination will be on the left\u003c/div\u003e',
                      maneuver: 'turn-left',
                      polyline: {
                        points: 'o_nGscjxRHJ@@FBHBb@LXH',
                      },
                      start_location: {
                        lat: 1.3875952,
                        lng: 103.7677761,
                      },
                      travel_mode: 'WALKING',
                    },
                  ],
                  travel_mode: 'WALKING',
                },
                {
                  distance: {
                    text: '14.9 km',
                    value: 14909,
                  },
                  duration: {
                    text: '43 mins',
                    value: 2580,
                  },
                  end_location: {
                    lat: 1.3045527,
                    lng: 103.8328461,
                  },
                  html_instructions: 'Bus towards Senja Rd',
                  polyline: {
                    points:
                      'o|mGkbjxRHUg@Qw@Y_@OQIYKc@Sc@MOGgA]a@SWMSIQQEIEGISEMCMAOCQ?Q@I@MBODSJWJSLSVi@BEXi@DGXe@N[f@_ANWJQTc@LUZo@Ra@NYPQPKFCHCHCNANAP?PFLF\\PbAj@v@b@PFfBv@lAl@r@^NJFDFDLJj@h@LLLLLNp@`A^d@LNLJ^Vv@\\`@VRJRFLFD?H@L@T?\\?\\?|@A|@?`@@r@?F?h@@RAN?@APAF@XAb@WJIHIJKJSFMFMDWBS@M?M?MCSAKCKEOEMGMCGEIIKGEIIOKWOWMIGMIQOMOMQGKISEQAIAIA]Di@FY@E?AF[@Mn@Dh@B`@@`@@T?\\?TAb@CH?VCXAH?J?Z?J?T?`@BZBPBLBRBL@x@RPFt@XdAf@NHFBl@`@RHlAp@JFhB|@RLRJxAr@XPJQHMBEHOBE?ADGHOLUXi@b@y@Xo@JW`@q@^m@LSr@oAd@{@b@w@RWPURUZWVM^QVMVKd@STMh@UTMBAJERGh@WZMb@O@APCJEBALCTIb@E|AQvBOzAKXAbAGl@CF?ZA\\?TAn@AB?`@?b@?T?xB?F??MfqGm{HGTJBND`@Lf@LbATlAVRAR?FAD?DADEDEDE@CHQv@gDNm@R}@BMLm@P}@FSDIFIHKTaADY`@qBP{@Ji@Hc@Li@R{@Lm@\\_BTkAVcAZuAJg@DOP_ALk@XsAJc@j@iC@GXcATi@NWX]v@u@NMLKp@m@f@c@l@i@lAeA\\[\\Y@AzAqAJSDIDGZ[r@q@\\[nAiAl@o@ZWx@o@TQNGDCVSACAA?AAA@C?E@E@C@EBCHKDCDCDAFCDADADAD?D?D@@?D?B?B@B?@@B@@@@@FDBDDDBDBFDDBDDH@D?@@@@B?@@@@F?D@D?D?FAD?DAFA@?BA@AB?@ABA@A@DZBHFLDHFJLRBHNTNT`@n@@BFB@Dd@t@d@|@R\\R\\BDZf@FLR^f@v@z@pBd@|@R\\DJ@@P\\LTFNJTNT?@JLHLFFXVJF@?HFJHLFHDLDhBr@lAZn@Rz@XbBj@B?rAb@ZHVJjBp@VJf@NHDl@Vj@`@@EBA@A@ABAB?@@D@D@B?B?B?B?B?BAJCJCPG^s@P]Pa@MM',
                  },
                  start_location: {
                    lat: 1.387125,
                    lng: 103.767578,
                  },
                  transit_details: {
                    arrival_stop: {
                      location: {
                        lat: 1.3045527,
                        lng: 103.8328461,
                      },
                      name: 'Orchard Stn/Tang Plaza',
                    },
                    arrival_time: {
                      text: '05:24',
                      time_zone: 'Asia/Singapore',
                      value: 1655587440,
                    },
                    departure_stop: {
                      location: {
                        lat: 1.387125,
                        lng: 103.767578,
                      },
                      name: 'Blk 516',
                    },
                    departure_time: {
                      text: '04:41',
                      time_zone: 'Asia/Singapore',
                      value: 1655584860,
                    },
                    headsign: 'Senja Rd',
                    headway: 1500,
                    line: {
                      agencies: [
                        {
                          name: 'SMRT Bus',
                          phone: '011 65 1800 336 8900',
                          url: 'http://www.smrt.com.sg/Journey-with-Us/SMRT-Buses',
                        },
                      ],
                      color: '#55dd33',
                      name: '972M',
                      text_color: '#000000',
                      vehicle: {
                        icon: '//maps.gstatic.com/mapfiles/transit/iw2/6/bus2.png',
                        name: 'Bus',
                        type: 'BUS',
                      },
                    },
                    num_stops: 22,
                  },
                  travel_mode: 'TRANSIT',
                },
                {
                  distance: {
                    text: '23.3 km',
                    value: 23258,
                  },
                  duration: {
                    text: '44 mins',
                    value: 2640,
                  },
                  end_location: {
                    lat: 1.356501,
                    lng: 103.986351,
                  },
                  html_instructions: 'Bus towards PTB2 Basement',
                  polyline: {
                    points:
                      'mx}FizvxRLLHQN_@N]LWbAcCBEPe@HQJWP_@Pa@Vg@Vk@`@_AHQP_@Na@P_@Rc@b@aA`@}@n@uAFQHSDMn@{AFIJ[X{@^mAJ_@?CDULw@Lk@@K@EDODQDSHa@Ja@Ha@FWJe@RcA^eBFW?CFQVcAj@gCFWT{@?AFYDO@C?ADU@A@IFWRy@BONq@BGBOLa@J_@?AJa@BODQJa@DUJc@Ha@Ja@DSf@qBBSBQ@UAi@AU?MC]Ce@?]?e@Be@@GBIBKLa@JQRYZa@LSV[^g@^e@NSbAuANSp@y@LQNQXa@PWr@_AjA_BLOp@aAvBaDt@gA^g@^i@DEFILULQRYn@}@FGNKJON[DENUZs@LSJQDIJUDIHON_@Zq@^y@Tc@Tg@BGBEBE?ATa@LUISAGEGOSq@[cBw@{@c@KEw@]KGw@_@]OOGKJIDEBE@G@E@E?I?MAKCIEIICCA?CACIACACAEACAC?CAM?C?E@G?CBEDIDGFGHGBA@A@?@A@?@ABA@AB?BA@?BAB?D??A@@B?B?B?B@B?DABCDIDEBEh@kABGDGn@oAb@}@JKJIHEFCFCPGJCXCXCj@AN?F?PAb@AB?N?LA\\AD?L?\\?T?p@AFGDCFCFA\\M?A?C@u@?I@MByA@S@S?ABe@ASCICKEQCGGIKKIGGCIEIAM?KAI@Q?G?I@W@U@UBOBSBOBMBUF]JqA^e@LKBSDK@OBK?M?O?S?WA[Cc@COAI?m@Ea@Cm@ESAO?SBK@M@KDG@KBGFEBQHGDGDOLOJMLGJKZI`@CJ?D?D?F@D@D@D@B@BBBBDBBB@@@XJvBGbAUj@Q\\OXOTQRQRUPQLSPYHSFQFY@AFW@ID[@U@WA[AYEw@Es@K}ASkCIw@?MF[_@uCC[AIYaCMeAOoACG?CCWEY?CCEYeCAGOwA?IQ_BKeASqBEU?AIeAAc@?a@?Q?OC{B?UAmA?}@Ai@?GA}@?OC{CC_A?IAa@?i@Ac@?g@?i@Cw@Aw@?O?CC_CAmAAw@Am@AoB?MAgACmAAa@?MAKCiAC{@C}@CuAEeDIuFCy@IkG?IAW?G?O?g@?S?eC?IB_CDkC?c@JaGByALuH@o@?iCAoACY?WA[M{ASaB[kBOm@EWq@eCc@_BMc@M]aA_DGWKECAAAAAAAAGAAISCKGSCIEIGOIOEIGGGIGEICMEGAE?E?Q?M@k@FA?_@FWFiAPm@JaDb@_BR[Ag@DG?{@L_BXSFw@TSDEUEa@COi@eDOy@Ia@EQACMa@Uu@]cAK_@M_@Ma@GSYw@EMLCh@Kf@M^MXIFANEt@SnAi@t@[NGTKh@[LKJGFIFKBEBE?M?I?G@G@G?QCOCKEKMOiAsAUYMOIOQ[IOIOKQYg@g@aAcA{Bi@eA_@i@S[ACQYIO]q@GKgBmC]i@U]MSYg@GO_@s@M[O[g@gAEIWk@_AoCaAgCEKGOOm@Oq@CK?ACKC]AC[oBWiBKm@G_@I{@Cu@?CA_@?c@CQAKAIAKI[EYWuAc@iAIYI_@Ie@Gc@EYOcAU_BACM_A]sCGy@Ei@Is@OuAo@_HE]Iy@Gg@M}@ACGc@QcACQMaAIo@m@sEEs@I_DC[?IAMAICUEWS{@Og@YkAW}@CQRCv@IzAOJ?R@h@G`AKNA`AO`@GPIHEFGDEBE@E?A@C@I?E?G?IAKCWa@{@O]Qa@GQYo@ACMWi@uAIOMk@Me@G[ESCUC_@@_@?UCeAe@iCaAyF[yAS_A]kBIc@m@eDYuA_@uBuAmH[eBKi@K[E]i@wCUmAOw@cEoTGUKo@Ii@W_BAOEa@G}@Cc@AOAq@AcBMuMCmEAm@A{@Cw@Aq@Ci@C_@Ce@E]Ee@Gc@Ki@Ga@I_@Om@c@yA]mAo@sBUu@g@}Ac@}Aa@qAq@yBe@{Aw@kC}@uCo@uBe@yAc@wASo@u@gCc@uAy@qCiAqDo@sBi@gBm@qBk@iBsCkJISGOMa@c@gASc@QWYi@Q]U_@k@u@QW_@a@W[w@w@o@k@SQYUOMQM]UeAq@WOm@]YQk@]gBgAiAq@KGGEkDqB}@g@iBgAc@USOSM_EaCUMQMyA_AIEECWO}DcC}AaAYQ_@YoAw@_DgBuAy@uBsAeDuB{@g@aAo@wAw@gC_Bs@_@yA{@aCsAw@c@ECIEMIOISQGESMs@a@{DiBaDqAaGkBmCy@s@SuBs@gEsAOEECy@WMEQEi@QYI[Kg@O_@MuAc@oAa@}Ag@{Ae@qBo@KEyAg@c@Oc@QWIIAOG[IMEIE{@Yy@Yk@O_A[q@SwAe@k@OkAa@OBK?]AM@MDc@AY@S@IAI?YAYE}@Sg@O]OmAi@_@EGC]IUGYIWEc@OsAc@}DoAuCaA]YUKy@WUGmGsBk@S_BtE',
                  },
                  start_location: {
                    lat: 1.3045527,
                    lng: 103.8328461,
                  },
                  transit_details: {
                    arrival_stop: {
                      location: {
                        lat: 1.356501,
                        lng: 103.986351,
                      },
                      name: 'Changi Airport PTB3',
                    },
                    arrival_time: {
                      text: '06:17',
                      time_zone: 'Asia/Singapore',
                      value: 1655590620,
                    },
                    departure_stop: {
                      location: {
                        lat: 1.3045527,
                        lng: 103.8328461,
                      },
                      name: 'Orchard Stn/Tang Plaza',
                    },
                    departure_time: {
                      text: '05:33',
                      time_zone: 'Asia/Singapore',
                      value: 1655587980,
                    },
                    headsign: 'PTB2 Basement',
                    headway: 540,
                    line: {
                      agencies: [
                        {
                          name: 'Go-Ahead Singapore',
                          phone: '011 65 6812 6458',
                          url: 'https://www.go-aheadsingapore.com/en-sg/',
                        },
                      ],
                      color: '#55dd33',
                      name: '36',
                      text_color: '#000000',
                      vehicle: {
                        icon: '//maps.gstatic.com/mapfiles/transit/iw2/6/bus2.png',
                        name: 'Bus',
                        type: 'BUS',
                      },
                    },
                    num_stops: 22,
                  },
                  travel_mode: 'TRANSIT',
                },
                {
                  distance: {
                    text: '0.7 km',
                    value: 684,
                  },
                  duration: {
                    text: '8 mins',
                    value: 479,
                  },
                  end_location: {
                    lat: 1.3504076,
                    lng: 103.9849413,
                  },
                  html_instructions:
                    'Walk to 78 Airport Blvd., Jewel Changi Airport, Singapore 819666',
                  polyline: {
                    points: 'ezgGc`uyRh@PlGrBVFj@R`@N\\XtC`A~DpApA`@d@NVFVFVF\\JF@\\DlAh@',
                  },
                  start_location: {
                    lat: 1.3560335,
                    lng: 103.9873847,
                  },
                  steps: [
                    {
                      distance: {
                        text: '0.7 km',
                        value: 684,
                      },
                      duration: {
                        text: '8 mins',
                        value: 479,
                      },
                      end_location: {
                        lat: 1.3504076,
                        lng: 103.9849413,
                      },
                      html_instructions:
                        'Walk \u003cb\u003esouth-west\u003c/b\u003e on \u003cb\u003eT3 Departure Dr\u003c/b\u003e\u003cdiv style="font-size:0.9em"\u003eDestination will be on the left\u003c/div\u003e',
                      polyline: {
                        points: 'ezgGc`uyRh@PlGrBVFj@R`@N\\XtC`A~DpApA`@d@NVFVFVF\\JF@\\DlAh@',
                      },
                      start_location: {
                        lat: 1.3560335,
                        lng: 103.9873847,
                      },
                      travel_mode: 'WALKING',
                    },
                  ],
                  travel_mode: 'WALKING',
                },
              ],
              traffic_speed_entry: [],
              via_waypoint: [],
            },
          ],
          overview_polyline: {
            points:
              'exmGqdjxRe@bAUTcDiAILHJHDl@P\\BHUg@QwAi@sBw@qCgAe@[KQU_A?{@`@oAbAmBvCmFn@qA`@k@l@W^Cb@FfDhBzFlCl@b@tAtAlBbClCxAp@PpH@jCCdAw@`@gAD}@O{@Wm@k@g@gAo@m@q@Y{@Cg@LcAJq@|CLrDKhA?|ANlB`@rCnAzCdBjFjCXPJQLSLWbDkGfCmE|A{Br@e@v@_@|BcAdDuAn@Ox@OtEa@fFYvACpGA?MfqGm{HGTJBp@RjBb@`BTZAVMFI`AyDt@gDXqALS^mAf@kCt@sDtAuGjCuLl@qCn@mBh@u@fAcAtCgCjC}BfBeBJQ|DsDxCiCTKTWAIDUXWXIf@@^XZl@Fh@I`@?b@Xl@~AfCnDjGdEfIb@|@v@z@b@XnCfAhLnDtDrAxAx@DGJEPDN?l@Qp@qAPa@MMLLHQ^}@fBgEx@kBbDkHdEoJpAeE`@}Bt@mDnByIrCcM|CyM@gBGoBH}APm@^k@`ByBbCcDhGgIzHcLjCoDfBiDbCkFTc@LUISGOOSq@[_D{AcAc@aBw@OGKJOHYDm@KSOOq@@UNW\\UXIZ@TUv@aBrAmCVUj@UjBMlACfCCp@AFGLGd@UNwFO{@a@e@i@Ko@?oCXkD`A{@N}@?gBKgCOcABm@Lg@Zu@l@Sf@Ml@@XDNLPDBXJvBGbAUhAa@vAiAz@sAXeAJsAOaDi@oHF[_@uCEe@{@_HIy@o@kFq@aHQaCC_EI}LKcIMoNQeJg@w[?sAH{K\\uTCcHAs@a@}Dk@yCw@}CaCaIS]ECGMY}@]s@a@[a@GmAHoDl@aGv@cABwDn@kAZKw@gAqGk@mBeAeDa@kAEMLCpAYx@W|CeAdCkAh@i@Fc@Bi@G[S[wBmCq@mAoDkHgAcBwC{E{AcCeA{BeCmG_BqEWkAy@{FSmAMqBEyAO}@]oBm@cBa@cCu@gFeCyVmAuIs@gGM{DGw@cAgE[oAjAMdDUtDe@h@]FQ@a@Ec@q@yAu@gBoAiD_@kBE{CgGi\\oFsYgFmXi@{DOcDUuXKoESiCe@oCaCiIqI{XsUcv@cBmDeBkC_DaDoAcAaL_HsLcHgP{JgFeDuFaD{GiE}IoFgIsE}AcAoFkCaDqAaGkBaEmA}HgC}Ag@uAa@uPmF_FcBgIiCcCu@kAa@OBi@A[F{A?c@AwAYeA_@mAi@_@Ee@Mo@QmIiCuCaA]YoAc@cH{Bk@S_BtE|AmEh@PdHzBlAb@\\XtC`ApGrB|@VtA\\\\DlAh@',
          },
          summary: '',
          warnings: [
            'Walking directions are in beta. Use caution – This route may be missing pavements or pedestrian paths.',
          ],
          waypoint_order: [],
        },
      ],
      status: 'OK',
    };

    //Coordinates used to draw the path from origin to destination
    const polyline = resJson.routes[0].overview_polyline.points;
    const points = decode(polyline).map((point) => {
      return { latitude: point[0], longitude: point[1] };
    });
    setCoords(points);

    //Data used to indicate transit transfer and destination points
    const markers = resJson.routes[0].legs[0].steps
      .filter((s) => s.travel_mode == 'TRANSIT')
      .map((s) => {
        return {
          coords: { latitude: s.end_location.lat, longitude: s.end_location.lng },
          title: s.transit_details.line.name + ' | ' + s.transit_details.arrival_stop.name,
        };
      });
    setMarkers(markers);
    console.log(markers);

    // try {
    //   const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${end}&mode=transit&key=${GOOGLE_MAPS_API_KEY}`;
    //   console.log(url);
    //   const response = fetch(url)
    //     .then((res) => res.json())
    //     .then((resJson) => {
    //       //const polyline = 'gs{F{nmxR_ALw@BKIKBMICMm@X]Do@^cBbAK@GELQMSSNwAx@mBvAgA`AKDI@Yb@i@p@U^k@fAqChG{AdDe@|@}DrHcCpEqBfEeCdF_ElIcAzBc@dAwA|Dk@dBiAzCy@dBsA`CyAxBeEtFs@v@{@t@}@n@iDxBcDvBgBrAsBdByDvDqEvECNKLqAzAoGrGuBtB}BtBoGfFgCnBwDrCmAz@GBMAgHxFwAzAw@tA_@nAgAlEUbA@PCj@i@dCo@pBQlA_@dCi@jG_@fE]bFCZGfCoB?}C?wAGaA@kDH{@HgALy@PwAb@mAj@y@d@k@f@KTWVYTqBvBcAlAm@`Aw@jAiDvFgCjEQVSK{@k@kAq@ILaAn@GGIKUQSY?CIY_@JiAPw@FCc@OmBAICAIBAA?COk@VGfDiBHPkCfAsFzB_Bh@cARaAFm@@wACgAO_AWo@Wm@]uAcAgCeBwDgCcIqFcO_K_EwCqCoBgFiDsBuAc@_@gAy@iEuCyByAsAw@cC{AsBoAa@S_Bq@sA_@}AQgAGsAA{FFgGL_CBkBAoA?aCDwGHqDRgADsDFoJLqCFg@DsCP{ATk@Nq@TcBt@qA|@wA|AiF~Fu@p@wA`BiKlLw@p@mA|@oAv@sDfB}An@iBl@eCf@sC`@e@Fk@FqBJoA@uACkBA}AGkAKyC[gBO_@E{BWsHy@yBMu@CmA?{BFaBD?HfBi@bAG\\AnAAxDb@nIz@f@@PAZKVUJONYdA{CVs@Vg@Xi@j@aBrBeGd@wATgAZaAtDoKdDsJd@yAJ_@@eA?w@CQe@wAOo@_@aCOg@_@u@{@}AmBmDk@cAOa@a@cBq@qCe@aBw@mCOm@?e@BSJURYt@_@tCmA~@e@VSNYDY@[Cq@UsASkABc@c@iCS}@Iu@I}@CS?c@JgANs@Xq@h@kAfAeBv@kArFgKd@eA~@uBFe@A[I]_@e@g@YeCqAaBu@uBmAmAg@y@WwAYsAGwGGaCGu@@WJUPKNM^Cj@@rBDbICl@KVURUJq@@}@?U?a@GwAo@iAm@]_@_A}AcB_BYS_Ae@aBy@c@KO?e@DSFw@b@y@j@_@\\e@n@u@zAs@fBWd@FBGd@BEHFTJm@pAQ^MVe@hAtAh@rDtAl@RJU^w@';
    //       const polyline = resJson.routes[0].overview_polyline.points;
    //       const points = decode(polyline).map((point) => {
    //         return {latitude: point[0], longitude: point[1]};
    //       });
    //       setCoords(points);

    //       console.log(resJson.routes[0].legs[0].steps
    //         .filter(x => x.travel_mode == "TRANSIT")
    //         .map(y => y.transit_details.line.name)
    //       );
    //     });
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const setAlarm = () => {
    if (markers.length == 0) {
      Alert.alert('No waypoints found', 'Please search for directions with transit stops', [
        { text: 'OK' },
      ]);
      return;
    }

    Alert.alert('Confirm', 'Are you sure you want to set the following waypoints?', [
      { text: 'OK', onPress: () => navigation.navigate('Map', { requests: markers }) },
      { text: 'Cancel' },
    ]);
    return;
  };

  const setOriginToCurrent = () => {
    Location.getCurrentPositionAsync().then((loc) => {
      setOriginText(loc.coords.latitude + ', ' + loc.coords.longitude);
    });
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        label="Origin"
        mode="outlined"
        value={originText}
        onChangeText={(txt) => setOriginText(txt)}
        right={<TextInput.Icon name="crosshairs-gps" onPress={setOriginToCurrent} />}
      />
      <TextInput
        label="Destination"
        mode="outlined"
        value={destinationText}
        onChangeText={(txt) => setDestinationText(txt)}
      />
      <Button mode="contained" onPress={() => searchDirections(originText, destinationText)}>
        Search
      </Button>

      <View style={{ flex: 1, padding: 10 }}>
        <MapView zoomControlEnabled showsUserLocation style={{ flex: 1 }}>
          {markers.map((m, index) => (
            <MapView.Marker
              key={index}
              coordinate={m.coords}
              title={m.title}
              description="test"
            ></MapView.Marker>
          ))}

          <MapView.Polyline
            coordinates={coords}
            strokeWidth={6}
            strokeColor={'rgba(0, 132, 184, 0.8)'}
          />
        </MapView>
        <Button color="green" mode="contained" onPress={setAlarm}>
          Set Alarms
        </Button>
      </View>
    </View>
  );
};
DirectionsMenu.propTypes = {
  navigation: PropTypes.any.isRequired,
};
export default DirectionsMenu;
