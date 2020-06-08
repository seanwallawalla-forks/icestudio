``` json
{
	"version":"betaX",
	"type": "project",
	"main": "0000000000000000000000000000000000000000",
	"board": "icezum"
}
```


# Packages

``` json
{
	"version":"betaX",
	"type": "block",
	"id": "0000000000000000000000000000000000000000",
	"ref": "package",
	"data": {
		"name":"Complex",
		"version":"1.0",
		"description":"Example including projects as blocks",
		"author":"",
		"devices":["lattice"],
		"blocks":[
			"bfebb831-8b03-43e1-9b87-013f1b5a9cdf",
			"1b3c9084-f6f1-433c-afe6-6a4e36de8c68",
			"2716e75c-f7ad-421d-810b-63c309dd35ec",
			"bf4b5914-c791-42d3-b876-df0e03d5a9a4",
			"0fbbb687-4a61-4b1d-a022-8884a20bef5c",
			"21e9e7f9-9b8a-4fca-904d-e266f1496454",
			"6c809d38-547d-4c70-92eb-2d5c389429e7"
		],
		"wires":[
			["21e9e7f9-9b8a-4fca-904d-e266f1496454.out","6c809d38-547d-4c70-92eb-2d5c389429e7.in"],
			["bf4b5914-c791-42d3-b876-df0e03d5a9a4.07895985-9d14-4a6f-8f2d-b2a6ddf61852","0fbbb687-4a61-4b1d-a022-8884a20bef5c.in"],
			["21e9e7f9-9b8a-4fca-904d-e266f1496454.out","2716e75c-f7ad-421d-810b-63c309dd35ec.f6528039-852b-41f9-aa41-268994b3f631"],
			["2716e75c-f7ad-421d-810b-63c309dd35ec.60d40fc8-3388-4066-8f0a-af17e179a9bd","bf4b5914-c791-42d3-b876-df0e03d5a9a4.a4058fa5-b66e-4e5e-b542-28d7c3e9d3cd"],
			["bfebb831-8b03-43e1-9b87-013f1b5a9cdf.constant-out","1b3c9084-f6f1-433c-afe6-6a4e36de8c68.909655b9-5ef0-4c45-9494-c0238d2e4732"],
			["1b3c9084-f6f1-433c-afe6-6a4e36de8c68.ef743d41-5941-4831-becd-0d930c4eed54","2716e75c-f7ad-421d-810b-63c309dd35ec.95f8c313-6e18-4ee3-b9cf-7266dec53c93"]
		],
		"dependencies":[
			"777966d0c987f3eb6be83df69e69a56909f5d48d",
			"908ca1985aff9d41059e523e10681c2fbac1ad29",
			"dd6af852895fb14362cdc5cb5f47c76353d7c7ad"
		],
	}
}
```

``` json
{
	"version":"betaX",
	"type": "block",
	"id":"777966d0c987f3eb6be83df69e69a56909f5d48d",
	"ref": "package",
	"data": {
		"name":"Assign",
		"version":"1.1",
		"description":"Assign the value plus an offset to the 4bit output",
		"author":"",
		"devices":["lattice"],
		"blocks":[
			"909655b9-5ef0-4c45-9494-c0238d2e4732",
			"7e351e09-634d-407c-ab7e-452519468292",
			"b6bc7556-6362-45ca-80e5-6db7a3100c7d",
			"ef743d41-5941-4831-becd-0d930c4eed54"
		],
		"wires":[
			["909655b9-5ef0-4c45-9494-c0238d2e4732.constant-out","b6bc7556-6362-45ca-80e5-6db7a3100c7d.C"],
			["7e351e09-634d-407c-ab7e-452519468292.constant-out","b6bc7556-6362-45ca-80e5-6db7a3100c7d.D"],
			["b6bc7556-6362-45ca-80e5-6db7a3100c7d.out","ef743d41-5941-4831-becd-0d930c4eed54.in"]
		],
		"dependencies":[],
	}
}
```

``` json
{
	"version":"betaX",
	"type": "block",
	"id":"908ca1985aff9d41059e523e10681c2fbac1ad29",
	"ref": "package",
	"data": {
		"name":"Mux4:1",
		"version":"1.1",
		"description":"Multiplexer 4 to 1",
		"author":"",
		"devices":["lattice"],
		"blocks":[
			"95f8c313-6e18-4ee3-b9cf-7266dec53c93",
			"5e1563d7-86de-4618-a9b0-2a08075af9ec",
			"60d40fc8-3388-4066-8f0a-af17e179a9bd",
			"f6528039-852b-41f9-aa41-268994b3f631",
		],
		"wires":[
			["95f8c313-6e18-4ee3-b9cf-7266dec53c93.out","5e1563d7-86de-4618-a9b0-2a08075af9ec.data"],
			["f6528039-852b-41f9-aa41-268994b3f631.out","5e1563d7-86de-4618-a9b0-2a08075af9ec.sel"],
			["5e1563d7-86de-4618-a9b0-2a08075af9ec.out","60d40fc8-3388-4066-8f0a-af17e179a9bd.in"]
		],
		"dependencies":[],
	}
}
```

``` json
{
	"version":"betaX",
	"type": "block",
	"id":"dd6af852895fb14362cdc5cb5f47c76353d7c7ad",
	"ref": "package",
	"data": {
		"name":"Not",
		"version":"1.0",
		"description":"NOT logic gate",
		"author":"",
		"devices":["lattice"],
		"blocks":[
			"364b95cc-e8ff-4c65-b332-d6125c5968ee",
			"a4058fa5-b66e-4e5e-b542-28d7c3e9d3cd",
			"07895985-9d14-4a6f-8f2d-b2a6ddf61852"
		],
		"wires":[
			["a4058fa5-b66e-4e5e-b542-28d7c3e9d3cd.out","364b95cc-e8ff-4c65-b332-d6125c5968ee.a"],
			["364b95cc-e8ff-4c65-b332-d6125c5968ee.b","07895985-9d14-4a6f-8f2d-b2a6ddf61852.in"],
		],
		"dependencies":[],
	}
}
```

# Views

## Package instances

```
{
	"id":"0000000000000000000000000000000000000000",
	"type": "view",
	"image":"",
	"wires":[2,1,2,1,1,4]
	"vertices":[
		{ "wire": "2",
		  "points": [[288,288]]
		},
	],
	"state":{
		"pan":[0,0],
		"zoom":1
	}
}
```

```
{
	"id":"777966d0c987f3eb6be83df69e69a56909f5d48d",
	"type": "view",
	"image":"%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22557.531%22%20height=%22417.407%22%20viewBox=%220%200%20522.68539%20391.31919%22%3E%3Ctext%20style=%22line-height:125%25;text-align:center%22%20x=%22388.929%22%20y=%22571.69%22%20font-weight=%22400%22%20font-size=%22382.156%22%20font-family=%22sans-serif%22%20letter-spacing=%220%22%20word-spacing=%220%22%20text-anchor=%22middle%22%20transform=%22translate(-127.586%20-256.42)%22%3E%3Ctspan%20x=%22388.929%22%20y=%22571.69%22%3E=%3C/tspan%3E%3C/text%3E%3C/svg%3E"
	"wires":[1,1,1]
	"vertices":[],
	"state":{
		"pan":[0,0],
		"zoom":1
	}
}
```

```
{
	"id":"908ca1985aff9d41059e523e10681c2fbac1ad29",
	"type": "view",
	"image":"%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%22-252%20400.9%2081%2040%22%20width=%2281%22%20height=%2240%22%3E%3Cpath%20d=%22M-191%20419.9v-7.2l-41-11.8v40l41-11.7v-7.4zm-39%2018.5v-35l37%2010.8v13.5z%22/%3E%3C/svg%3E"
	"wires":[4,2,1]
	"vertices":[
		{ "wire": "2",
		  "points": [[232,176]]
		},
	],
	"state":{
		"pan":[0,0],
		"zoom":1
	}
}
```

```
{
	"id":"dd6af852895fb14362cdc5cb5f47c76353d7c7ad",
	"type": "view",
	"image":"%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2291.33%22%20height=%2245.752%22%20version=%221%22%3E%3Cpath%20d=%22M0%2020.446h27v2H0zm70.322.001h15.3v2h-15.3z%22/%3E%3Cpath%20d=%22M66.05%2026.746c-2.9%200-5.3-2.4-5.3-5.3s2.4-5.3%205.3-5.3%205.3%202.4%205.3%205.3-2.4%205.3-5.3%205.3zm0-8.6c-1.8%200-3.3%201.5-3.3%203.3%200%201.8%201.5%203.3%203.3%203.3%201.8%200%203.3-1.5%203.3-3.3%200-1.8-1.5-3.3-3.3-3.3z%22/%3E%3Cpath%20d=%22M25.962%202.563l33.624%2018.883L25.962%2040.33V2.563z%22%20fill=%22none%22%20stroke=%22#000%22%20stroke-width=%223%22/%3E%3C/svg%3E"
	"wires":[1,1]
	"vertices":[],
	"state":{
		"pan":[-38.5106,27.9681],
		"zoom":1.0904
	}
}
```

## Block instances

```
{
	"id":"bfebb831-8b03-43e1-9b87-013f1b5a9cdf",
	"type": "view",
	"position":[112,88]
}
```

```
{
	"id":"1b3c9084-f6f1-433c-afe6-6a4e36de8c68",
	"type": "view",
	"position":[112,208],
	"size":[96,64]
}
```

```
{
	"id":"2716e75c-f7ad-421d-810b-63c309dd35ec",
	"type": "view",
	"position":[368,224],
	"size":[96,64]
}
```

```
{
	"id":"bf4b5914-c791-42d3-b876-df0e03d5a9a4",
	"type": "view",
	"position":[536,224],
	"size":[96,64]
}
```

```
{
	"id":"0fbbb687-4a61-4b1d-a022-8884a20bef5c",
	"type": "view",
	"position":[704,224]
}
```

```
{
	"id":"21e9e7f9-9b8a-4fca-904d-e266f1496454",
	"type": "view",
	"position":[112,320]
}
```

```
{
	"id":"6c809d38-547d-4c70-92eb-2d5c389429e7",
	"type": "view",
	"position":[704,320]
}
```

```
{
	"id":"909655b9-5ef0-4c45-9494-c0238d2e4732",
	"type": "view",
	"position":[192,112]
}
```

```
{
	"id":"7e351e09-634d-407c-ab7e-452519468292",
	"type": "view",
	"position":[328,112]
}
```

```
{
	"id":"b6bc7556-6362-45ca-80e5-6db7a3100c7d",
	"type": "view",
	"position":[168,232],
	"size":[272,80]
}
```

```
{
	"id":"ef743d41-5941-4831-becd-0d930c4eed54",
	"type": "view",
	"position":[616,240],
}
```

```
{
	"id":"95f8c313-6e18-4ee3-b9cf-7266dec53c93",
	"type": "view",
	"position":[64,120],
}
```

```
{
	"id":"5e1563d7-86de-4618-a9b0-2a08075af9ec",
	"type": "view",
	"position":[312,152],
	"size":[272,144]
}
```

```
{
	"id":"60d40fc8-3388-4066-8f0a-af17e179a9bd",
	"type": "view",
	"position":[720,192]
}
```

```
{
	"id":"f6528039-852b-41f9-aa41-268994b3f631",
	"type": "view",
	"position":[64,232]
}
```

```
{
	"id":"364b95cc-e8ff-4c65-b332-d6125c5968ee",
	"type": "view",
	"position":[248,88]
}
```

```
{
	"id":"a4058fa5-b66e-4e5e-b542-28d7c3e9d3cd",
	"type": "view",
	"position":[72,184]
}
```

```
{
	"id":"07895985-9d14-4a6f-8f2d-b2a6ddf61852",
	"type": "view",
	"position":[728,184]
}
```

# Instances

## Packages

``` json
[
	{
		"version":"betaX",
		"type": "block",
		"id":"1b3c9084-f6f1-433c-afe6-6a4e36de8c68",
		"ref": "777966d0c987f3eb6be83df69e69a56909f5d48d",
		"data": {},
	},
	{
		"version":"betaX",
		"type": "block",
		"id":"2716e75c-f7ad-421d-810b-63c309dd35ec",
		"ref":"908ca1985aff9d41059e523e10681c2fbac1ad29",
		"data": {},
	},
	{
		"version":"betaX",
		"type": "block",
		"id":"bf4b5914-c791-42d3-b876-df0e03d5a9a4",
		"ref":"dd6af852895fb14362cdc5cb5f47c76353d7c7ad",
		"data": {},
	}
]
```

## basic.constant

``` json
{
	"version":"betaX",
	"type": "block",
	"id":"bfebb831-8b03-43e1-9b87-013f1b5a9cdf",
	"ref":"basic.constant",
	"data":{
		"name":"C",
		"value":"4'b1010",
		"local":false
	}
}
```

``` json
{
	"version":"betaX",
	"type": "block",
	"id":"909655b9-5ef0-4c45-9494-c0238d2e4732",
	"ref":"basic.constant",
	"data":{
		"name":"value",
		"value":"4'b1110",
		"local":false
	}
}
```

``` json
{
	"version":"betaX",
	"type": "block",
	"id":"7e351e09-634d-407c-ab7e-452519468292",
	"ref":"basic.constant",
	"data":{
		"name":"offset",
		"value":"0",
		"local":true
	}
}
```
## basic.input

``` json
{
	"version":"betaX",
	"type": "block",
	"id":"21e9e7f9-9b8a-4fca-904d-e266f1496454",
	"ref":"basic.input",
	"data":{
		"name":"in",
		"range":"[1:0]",
	},
}
```

``` json
{
	"version":"betaX",
	"type": "block",
	"id":"95f8c313-6e18-4ee3-b9cf-7266dec53c93",
	"ref":"basic.input",
	"data":{
		"name":"d",
		"range":"[3:0]",
	}
}
```

``` json
{
	"version":"betaX",
	"type": "block",
	"id":"f6528039-852b-41f9-aa41-268994b3f631",
	"ref":"basic.input",
	"data":{
		"name":"s",
		"range":"[1:0]"
	},
}
```

``` json
{
	"version":"betaX",
	"type": "block",
	"id":"a4058fa5-b66e-4e5e-b542-28d7c3e9d3cd",
	"ref":"basic.input",
	"data":{
		"name":"",
		"range":""
		}
}
```

## basic.output

``` json
{
	"version":"betaX",
	"type": "block",
	"id":"0fbbb687-4a61-4b1d-a022-8884a20bef5c",
	"ref":"basic.output",
	"data":{
		"name":"led",
		"range":"0",
	},
    "virtual":false
}
```

``` json
{
	"version":"betaX",
	"type": "block",
	"id":"6c809d38-547d-4c70-92eb-2d5c389429e7",
	"ref":"basic.output",
	"data":{
		"name":"debug",
		"range":"[1:0]",
	},
    "virtual":false
}
```

``` json
{
	"version":"betaX",
	"type": "block",
	"id":"ef743d41-5941-4831-becd-0d930c4eed54",
	"ref":"basic.output",
	"data":{
		"name":"out",
		"range":"[3:0]"
	}
}
```

``` json
{
	"version":"betaX",
	"type": "block",
	"id":"60d40fc8-3388-4066-8f0a-af17e179a9bd",
	"ref":"basic.output",
	"data":{
		"name":"out",
		"range":""
	}
}
```

``` json
{
	"version":"betaX",
	"type": "block",
	"id":"07895985-9d14-4a6f-8f2d-b2a6ddf61852",
	"ref":"basic.output",
	"data":{
		"name":"",
		"range":""
	}
}
```

## basic.code

``` json
{
	"version":"betaX",
	"type": "block",
	"id":"b6bc7556-6362-45ca-80e5-6db7a3100c7d",
	"ref":"basic.code",
	"data":{
		"code":"assign out = C + D;",
		"params":[
			{"name":"C"},
			{"name":"D"}
		],
		"ports":{
			"in":[],
			"out":[
				["out","[3:0]"]
			]
		}
	}
}
```

``` json
{
	"version":"betaX",
	"type": "block",
	"id":"364b95cc-e8ff-4c65-b332-d6125c5968ee",
	"ref":"basic.code",
	"data":{
		"code":"#gate_not",
		"params":[],
		"ports":{
			"in":[["a","0"]],
			"out":[["b","0"]]
		}
	}
}
```

``` json
{
	"version":"betaX",
	"type": "block",
	"id":"5e1563d7-86de-4618-a9b0-2a08075af9ec",
	"ref":"basic.code",
	"data":{
		"code":"#mux_41",
		"params":[
		],
		"ports":{
			"in":[
				["data","[3:0]"],
				["sel","[1:0]"],
			],
			"out":[
				["out","0"]
			]
		}
	}
}
```

# Code

``` verilog
// Ports directly parseable to 364b95cc-e8ff-4c65-b332-d6125c5968ee
module gate_not ( a, c );
 input a;
 output c;
 
 // NOT logic gate
 assign c = ~ a;
endmodule
```

``` verilog
// Ports directly parseable to 5e1563d7-86de-4618-a9b0-2a08075af9ec
module mux_41 ( in, sel, o );
 input [3:0] in;
 input [1:0] sel;
 output o;
 
 reg _o;
 wire [1:0] _sel;
 assign _sel = {sel1, sel0};
 always @(*) begin
     case(_sel)
         0: _o = in[0];
         1: _o = in[1];
         2: _o = in[2];
         3: _o = in[3];
         default: _o = in0;
     endcase
 end
 assign o = _o;
endmodule
```

# UCF

``` json
{
	"version":"betaX",
	"type": "ucf",
	"id": "0000000000000000000000000000000000000000",
	"board":"icezum",
	"pins":[
		["21e9e7f9-9b8a-4fca-904d-e266f1496454","in(0)","SW1","10"],
		["21e9e7f9-9b8a-4fca-904d-e266f1496454","in(1)","SW2","11"],
		["0fbbb687-4a61-4b1d-a022-8884a20bef5c","led","LED7","104"],
		["6c809d38-547d-4c70-92eb-2d5c389429e7","debug(1)","LED1","96"],
		["6c809d38-547d-4c70-92eb-2d5c389429e7","debug(0)","LED0","95"]
	]
}
