// 地点与标注数据，迁移自 UTSZ MAP。地点只用作初始数据：首次访问时写入数据库，之后由编辑在线维护。
import type { BuildingCodeOption, CampusId, MapTextMark, Poi, PoiCategory, PoiSpecialTag } from './types'

export const BASE_MAP = { src: "/plugins/utsz-map/base-map.svg", width: 1448, height: 1086 }

export const campusLabels: Record<CampusId, string> = {
  "hit": "哈工大（深圳）",
  "pku": "北京大学深圳研究生院",
  "tsinghua": "清华大学深圳国际研究生院"
}

export const categoryLabels: Record<PoiCategory, string> = {
  "building": "教学楼",
  "canteen": "食堂",
  "cafe": "咖啡",
  "service": "服务",
  "sport": "运动",
  "study": "学习",
  "leisure": "休闲",
  "landmark": "地标"
}

export const categoryOrder: PoiCategory[] = ["building","canteen","cafe","study","sport","service","leisure","landmark"]

export const markerColors: Record<PoiCategory, string> = {
  "building": "#1d7ef2",
  "canteen": "#d97706",
  "cafe": "#8b5e34",
  "service": "#58606a",
  "sport": "#23835f",
  "study": "#5b6ee1",
  "leisure": "#6c7a55",
  "landmark": "#b03a8c"
}

export const specialTagLabels: Record<PoiSpecialTag, string> = {
  "hit-teaching-side-entrance": "后门与侧门",
  "landmark": "地标"
}

export const specialTagHints: Partial<Record<PoiSpecialTag, string>> = {
  "hit-teaching-side-entrance": "哈工深的教学楼侧后门已实施特殊管控。可以参考航天物业的指示前往以下地点开通门禁：\nT2-T6、H、J、K、L栋一办理地点：T4101室\n研究生院A、C、E栋—办理地点：A111室\nM栋—办理地点：M103 室。"
}

export const buildingCodeOptions: BuildingCodeOption[] = [
  {
    "campus": "tsinghua",
    "code": "C1",
    "aliases": [
      "清华C1",
      "清华 C1"
    ]
  },
  {
    "campus": "tsinghua",
    "code": "C3",
    "aliases": [
      "清华C3",
      "清华 C3"
    ]
  },
  {
    "campus": "hit",
    "code": "T2",
    "aliases": [
      "哈工大T2",
      "哈工深T2",
      "HITSZ T2"
    ]
  },
  {
    "campus": "hit",
    "code": "T3",
    "aliases": [
      "哈工大T3",
      "哈工深T3",
      "HITSZ T3"
    ]
  },
  {
    "campus": "hit",
    "code": "T4",
    "aliases": [
      "哈工大T4",
      "哈工深T4",
      "HITSZ T4"
    ]
  },
  {
    "campus": "hit",
    "code": "T5",
    "aliases": [
      "哈工大T5",
      "哈工深T5",
      "HITSZ T5"
    ]
  },
  {
    "campus": "hit",
    "code": "T6",
    "aliases": [
      "哈工大T6",
      "哈工深T6",
      "HITSZ T6"
    ]
  },
  {
    "campus": "hit",
    "code": "A",
    "aliases": [
      "哈工大A栋",
      "哈工深A栋",
      "研究生院A栋"
    ]
  },
  {
    "campus": "hit",
    "code": "B",
    "aliases": [
      "哈工大B栋",
      "哈工深B栋",
      "研究生院B栋"
    ]
  },
  {
    "campus": "hit",
    "code": "C",
    "aliases": [
      "哈工大C栋",
      "哈工深C栋",
      "研究生院C栋"
    ]
  },
  {
    "campus": "hit",
    "code": "E",
    "aliases": [
      "哈工大E栋",
      "哈工深E栋",
      "研究生院E栋"
    ]
  },
  {
    "campus": "hit",
    "code": "G",
    "aliases": [
      "哈工大G栋",
      "哈工深G栋",
      "理学楼"
    ]
  },
  {
    "campus": "hit",
    "code": "H",
    "aliases": [
      "哈工大H栋",
      "哈工深H栋",
      "主楼"
    ]
  },
  {
    "campus": "hit",
    "code": "J",
    "aliases": [
      "哈工大J栋",
      "哈工深J栋",
      "活动中心"
    ]
  },
  {
    "campus": "hit",
    "code": "K",
    "aliases": [
      "哈工大K栋",
      "哈工深K栋",
      "实训楼"
    ]
  },
  {
    "campus": "hit",
    "code": "L",
    "aliases": [
      "哈工大L栋",
      "哈工深L栋",
      "信息楼"
    ]
  },
  {
    "campus": "hit",
    "code": "M",
    "aliases": [
      "哈工大M栋",
      "哈工深M栋",
      "经管楼"
    ]
  },
  {
    "campus": "hit",
    "code": "设A",
    "aliases": [
      "哈工大设A",
      "哈工深设A",
      "国际设计学院A栋"
    ]
  },
  {
    "campus": "hit",
    "code": "设B",
    "aliases": [
      "哈工大设B",
      "哈工深设B",
      "国际设计学院B栋"
    ]
  }
]

export const mapTextMarks: MapTextMark[] = [
  {
    "id": "hit-southwest-gate",
    "text": "西南门",
    "position": {
      "x": 19.34,
      "y": 71.44
    },
    "rotate": 24
  },
  {
    "id": "hit-south-gate",
    "text": "南门",
    "position": {
      "x": 38.84,
      "y": 82.23
    },
    "rotate": 0
  },
  {
    "id": "university-town-main-gate",
    "text": "大学城正门",
    "position": {
      "x": 64.65,
      "y": 87.34
    },
    "rotate": -32
  }
]

export const seedPois: Poi[] = [
  {
    "id": "phbs",
    "name": "北京大学汇丰商学院",
    "campus": "pku",
    "category": "building",
    "position": {
      "x": 43.5,
      "y": 46.52
    },
    "photos": [
      {
        "src": "/plugins/utsz-map/pics/live-shooting/PHBS-distant-view.webp",
        "caption": "北京大学汇丰商学院"
      }
    ],
    "description": "大学城中部地标，后续可细分 PHBS 主楼、星巴克和入口点。",
    "entranceHint": "位置为底图相对坐标，需要用实拍 GPS 或人工点击继续校准。",
    "needsReview": true
  },
  {
    "id": "phbs-starbucks",
    "name": "星巴克",
    "category": "cafe",
    "position": {
      "x": 41.22,
      "y": 47.63
    },
    "photos": [
      {
        "src": "/plugins/utsz-map/pics/live-shooting/PHBS-starbucks.webp",
        "caption": "星巴克"
      }
    ],
    "description": "",
    "needsReview": true
  },
  {
    "id": "library-bank",
    "name": "图书馆 / 平安银行",
    "category": "study",
    "position": {
      "x": 51,
      "y": 53.8
    },
    "photos": [
      {
        "src": "/plugins/utsz-map/pics/live-shooting/library-door-pingan-bank.webp",
        "caption": "图书馆 / 平安银行"
      }
    ],
    "description": "学习和银行服务相关地点，可作为第一批高频 POI。",
    "needsReview": true
  },
  {
    "id": "icc-of-utsz",
    "name": "大学城国际会议中心",
    "category": "service",
    "position": {
      "x": 36,
      "y": 50
    },
    "photos": [
      {
        "src": "/plugins/utsz-map/pics/live-shooting/icc-of-utsz.webp",
        "caption": "大学城国际会议中心"
      }
    ],
    "description": "",
    "needsReview": true
  },
  {
    "id": "liyuan-canteen-3",
    "name": "荔园三食堂 & KFC",
    "category": "canteen",
    "position": {
      "x": 30.9,
      "y": 77.9
    },
    "photos": [
      {
        "src": "/plugins/utsz-map/pics/live-shooting/liyuan-canteen3-and-kfc.webp",
        "caption": "三食堂正门"
      }
    ],
    "description": "食堂侧门点位，适合做入口级导航。",
    "needsReview": true
  },
  {
    "id": "liyuan-canteen-4",
    "name": "荔园四食堂",
    "category": "canteen",
    "position": {
      "x": 37.97,
      "y": 73.81
    },
    "photos": [
      {
        "src": "/plugins/utsz-map/pics/live-shooting/liyuan-canteen4-sidedoor.webp",
        "caption": "四食堂侧门"
      },
      {
        "src": "/plugins/utsz-map/pics/live-shooting/liyuan-canteen4-goodme.webp",
        "caption": "古茗"
      },
      {
        "src": "/plugins/utsz-map/pics/live-shooting/liyuan-canteen4-garden.webp",
        "caption": "花园"
      }
    ],
    "description": "食堂侧门点位，适合做入口级导航。",
    "needsReview": true
  },
  {
    "id": "liyuan-opposite",
    "name": "荔园7-10栋对面 风洞实验室&电动车充电处",
    "category": "service",
    "position": {
      "x": 34.16,
      "y": 71.83
    },
    "photos": [
      {
        "src": "/plugins/utsz-map/pics/live-shooting/liyuan-opposite-lab.webp",
        "caption": "风洞实验室"
      },
      {
        "src": "/plugins/utsz-map/pics/live-shooting/liyuan-opposite-charger.webp",
        "caption": "电动车充电处"
      }
    ],
    "description": "风洞实验室不对外开放。\n给自己的电动车充电需要先扫码登记。",
    "needsReview": true
  },
  {
    "id": "hit-playground",
    "name": "哈工深操场",
    "campus": "hit",
    "category": "sport",
    "position": {
      "x": 15.15,
      "y": 56.89
    },
    "photos": [
      {
        "src": "/plugins/utsz-map/pics/live-shooting/playground.webp",
        "caption": "哈工深操场"
      }
    ],
    "description": "运动区域 POI，后续可细分跑道、球场和入口。\n军训场地，以及体基班上课区域。",
    "needsReview": true
  },
  {
    "id": "hit-luckin",
    "name": "荔园十栋瑞幸咖啡",
    "campus": "hit",
    "category": "cafe",
    "position": {
      "x": 38.04,
      "y": 77.22
    },
    "photos": [
      {
        "src": "/plugins/utsz-map/pics/live-shooting/hit-luckin.webp",
        "caption": "荔园十栋瑞幸咖啡"
      }
    ],
    "description": "HIT 园区内的咖啡点位，可作为无实拍图占位展示测试。",
    "needsReview": true
  },
  {
    "id": "hit-liyuan6-liyuan7-walkway",
    "name": "荔园6-7栋连廊",
    "campus": "hit",
    "category": "leisure",
    "position": {
      "x": 30.7,
      "y": 72.9
    },
    "photos": [
      {
        "src": "/plugins/utsz-map/pics/live-shooting/liyuan6-liyuan7-walkway.webp",
        "caption": "荔园6-7栋连廊"
      }
    ],
    "description": "",
    "needsReview": true
  },
  {
    "id": "mountain",
    "name": "山体公园",
    "category": "leisure",
    "position": {
      "x": 63,
      "y": 60
    },
    "photos": [],
    "description": "",
    "needsReview": true
  },
  {
    "id": "hit-t4",
    "name": "哈工深T4教学楼",
    "campus": "hit",
    "buildingCodes": [
      "T4"
    ],
    "category": "building",
    "position": {
      "x": 41.15,
      "y": 77.6
    },
    "photos": [
      {
        "src": "/plugins/utsz-map/pics/live-shooting/hit-T4-backdoor.webp",
        "caption": "T4后门"
      }
    ],
    "specialTags": [
      "hit-teaching-side-entrance"
    ],
    "description": "T4 教学楼点位。正门、后门和侧门距离较近时，可合并在这个地点下用多张照片区分。",
    "needsReview": true
  },
  {
    "id": "hit-t5",
    "name": "哈工深T5教学楼",
    "campus": "hit",
    "buildingCodes": [
      "T5"
    ],
    "category": "building",
    "position": {
      "x": 44.05,
      "y": 77.6
    },
    "photos": [
      {
        "src": "/plugins/utsz-map/pics/live-shooting/hit-T5-backdoor.webp",
        "caption": "T5后门"
      }
    ],
    "specialTags": [
      "hit-teaching-side-entrance"
    ],
    "description": "T5 教学楼点位。正门、后门和侧门距离较近时，可合并在这个地点下用多张照片区分。",
    "needsReview": true
  },
  {
    "id": "hit-t6",
    "name": "哈工深T6教学楼",
    "campus": "hit",
    "buildingCodes": [
      "T6"
    ],
    "category": "building",
    "position": {
      "x": 47.16,
      "y": 79.32
    },
    "photos": [
      {
        "src": "/plugins/utsz-map/pics/live-shooting/hit-T6-distant-view.webp",
        "caption": "T6远景"
      },
      {
        "src": "/plugins/utsz-map/pics/live-shooting/hit-T6-backdoor.webp",
        "caption": "T6后门"
      }
    ],
    "specialTags": [
      "hit-teaching-side-entrance"
    ],
    "description": "T6 教学楼点位。正门、后门和侧门距离较近时，可合并在这个地点下用多张照片区分。",
    "needsReview": true
  },
  {
    "id": "hit-t2",
    "name": "哈工深T2教学楼",
    "campus": "hit",
    "buildingCodes": [
      "T2"
    ],
    "category": "building",
    "position": {
      "x": 51,
      "y": 70.2
    },
    "photos": [
      {
        "src": "/plugins/utsz-map/pics/live-shooting/hit-T2-backdoor.webp",
        "caption": "T2后门"
      }
    ],
    "specialTags": [
      "hit-teaching-side-entrance"
    ],
    "description": "T2 教学楼点位。正门、后门和侧门距离较近时，可合并在这个地点下用多张照片区分。",
    "needsReview": true
  },
  {
    "id": "hit-main-building",
    "name": "哈工深主楼&火箭模型",
    "campus": "hit",
    "buildingCodes": [
      "H"
    ],
    "category": "building",
    "position": {
      "x": 47.27,
      "y": 71.15
    },
    "photos": [
      {
        "src": "/plugins/utsz-map/pics/live-shooting/hit-H-distant-view.webp",
        "caption": "主楼远景"
      },
      {
        "src": "/plugins/utsz-map/pics/live-shooting/hit-H-left-sidedoor.webp",
        "caption": "主楼侧门"
      },
      {
        "src": "/plugins/utsz-map/pics/live-shooting/hit-H-right-sidedoor.webp",
        "caption": "主楼侧门"
      }
    ],
    "specialTags": [
      "hit-teaching-side-entrance"
    ],
    "description": "H 教学楼点位。正门、后门和侧门距离较近时，可合并在这个地点下用多张照片区分。",
    "needsReview": true
  },
  {
    "id": "hit-experimental-building",
    "name": "哈工深实训楼",
    "campus": "hit",
    "buildingCodes": [
      "K"
    ],
    "category": "building",
    "position": {
      "x": 44.8,
      "y": 63.4
    },
    "photos": [
      {
        "src": "/plugins/utsz-map/pics/live-shooting/hit-experimental-building.webp",
        "caption": "哈工深实训楼"
      }
    ],
    "specialTags": [
      "hit-teaching-side-entrance"
    ],
    "description": "",
    "needsReview": true
  },
  {
    "id": "hit-science-building",
    "name": "哈工深理学楼",
    "campus": "hit",
    "buildingCodes": [
      "G"
    ],
    "category": "building",
    "position": {
      "x": 35,
      "y": 58.7
    },
    "photos": [
      {
        "src": "/plugins/utsz-map/pics/live-shooting/hit-information-building-distant-view.webp",
        "caption": "理学楼"
      },
      {
        "src": "/plugins/utsz-map/pics/live-shooting/hit-information-building-door.webp",
        "caption": "理学楼外卖柜"
      }
    ],
    "description": "G栋 理学楼点位。正门、后门和侧门距离较近时，可合并在这个地点下用多张照片区分。",
    "needsReview": true
  },
  {
    "id": "hit-information-building",
    "name": "哈工深信息楼",
    "campus": "hit",
    "buildingCodes": [
      "L"
    ],
    "category": "building",
    "position": {
      "x": 43,
      "y": 56
    },
    "photos": [
      {
        "src": "/plugins/utsz-map/pics/live-shooting/hit-information-building-distant-view.webp",
        "caption": "信息楼远景"
      },
      {
        "src": "/plugins/utsz-map/pics/live-shooting/hit-information-building-door.webp",
        "caption": "信息楼正门"
      }
    ],
    "specialTags": [
      "hit-teaching-side-entrance"
    ],
    "description": "L栋 信息楼点位。正门、后门和侧门距离较近时，可合并在这个地点下用多张照片区分。",
    "needsReview": true
  },
  {
    "id": "hit-m",
    "name": "哈工深经管楼",
    "campus": "hit",
    "buildingCodes": [
      "M"
    ],
    "category": "building",
    "position": {
      "x": 13.03,
      "y": 49.06
    },
    "photos": [
      {
        "src": "/plugins/utsz-map/pics/live-shooting/hit-M-distant-view.webp",
        "caption": "经管楼远景"
      },
      {
        "src": "/plugins/utsz-map/pics/live-shooting/hit-M-inner-L1.webp",
        "caption": "经管楼1楼内部"
      }
    ],
    "specialTags": [
      "hit-teaching-side-entrance"
    ],
    "description": "",
    "needsReview": true
  },
  {
    "id": "hit-sisd",
    "name": "哈工深国际设计学院",
    "campus": "hit",
    "category": "building",
    "position": {
      "x": 54,
      "y": 77.5
    },
    "photos": [
      {
        "src": "/plugins/utsz-map/pics/live-shooting/hit-sisd.webp",
        "caption": "哈工深国际设计学院"
      }
    ],
    "description": "国际设计学院",
    "entranceHint": "内有茶水间、图书馆",
    "needsReview": true
  },
  {
    "id": "hit-recreation-center",
    "name": "哈工深活动中心",
    "campus": "hit",
    "buildingCodes": [
      "J"
    ],
    "category": "building",
    "position": {
      "x": 43.7,
      "y": 68.4
    },
    "photos": [
      {
        "src": "/plugins/utsz-map/pics/live-shooting/hit-recreation-center.webp",
        "caption": "哈工深活动中心"
      }
    ],
    "specialTags": [
      "hit-teaching-side-entrance"
    ],
    "description": "-\n三楼有乒乓球桌。",
    "needsReview": true
  },
  {
    "id": "hit-stone",
    "name": "哈工深校训石",
    "category": "landmark",
    "position": {
      "x": 38.38,
      "y": 63.64
    },
    "photos": [
      {
        "src": "/plugins/utsz-map/pics/live-shooting/hit-motto-stone.webp",
        "caption": "哈工深校训石"
      }
    ],
    "specialTags": [
      "landmark"
    ],
    "description": "",
    "needsReview": true
  },
  {
    "id": "rainbow-bridge",
    "name": "彩虹桥",
    "category": "landmark",
    "position": {
      "x": 69,
      "y": 36.51
    },
    "photos": [
      {
        "src": "/plugins/utsz-map/pics/live-shooting/rainbow-bridge.webp",
        "caption": "彩虹桥"
      }
    ],
    "specialTags": [
      "landmark"
    ],
    "description": "",
    "needsReview": true
  },
  {
    "id": "pku-mirror-lake",
    "name": "北大镜湖",
    "category": "landmark",
    "position": {
      "x": 74,
      "y": 25.5
    },
    "photos": [
      {
        "src": "/plugins/utsz-map/pics/live-shooting/pku-mirror-lake.webp",
        "caption": "北大镜湖"
      }
    ],
    "specialTags": [
      "landmark"
    ],
    "description": "",
    "needsReview": true
  }
]
