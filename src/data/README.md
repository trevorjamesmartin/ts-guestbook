# Database

<img style="float: right; max-height: 34rem" src="./db_design.jpg">

_identity_

|post |author|thread|parent|
|-----|------|------|------|
| 101 |  28  |      |      |
| 102 |  29  | 101  | 101  |
| 103 |  41  | 101  | 102  |
| 104 |  56  | 101  | 101  |
| 105 |  24  | 101  | 101  |

_content_
```
101  Todays jam is being served
102  └── yesterdays jam was better!
103      └── I wasn't here yesterday
104  ├── save me some toast
105  ├── todays jam is very good!
```
