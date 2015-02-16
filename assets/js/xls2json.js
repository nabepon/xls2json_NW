
(function(){
	
	var xlsjs = require('xlsjs');
	var fs = require('fs');
	var _ = require('lodash');
	var input_dir = './assets/data/';
	var output_dir = './assets/json/';
	
	var xlsSheetToJSON = function(sheet_name,raw_data){
		
		// 列のアルファベットを数字に変換
		var alphabet = {A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:10,K:11,L:12,M:13,N:14,O:15,P:16,Q:17,R:18,S:19,T:20,U:21,V:22,W:23,U:24,X:25,Y:26,Z:27};
		var colToNum = function(str){
			var num = 0;
			var digit = 0;
			for(var i in str){
				digit = i*27;
				num += alphabet[str[i]] + digit;
			}
			return num
		}
		
		// 生データから行列番号を追加、整理したデータ作成
		var all_data = _.reduce(raw_data,function(result,data,key){
			var col_str = key.match(/[A-Z]*/)[0];
			var col = colToNum(col_str)
			var row = parseInt( key.replace(col_str,"") );
			data.cell = key;
			data.row = row;
			data.col = col;
			data.col_str = col_str;
			data = _.omit(data,"ixfe");
			if( !result[row] ) result[row] = {};
			result[row][col] = data;
			return result
		},{})
		
		// json作成
		var NAME_COL = 1;
		var KEY_COL  = 2;
		var TYPE_COL = 3;
		var json_data = _.reduce(all_data,function(result,row_data,key){
			if(row_data[1] == undefined || row_data[1].row <= 3) return result;
			var id = row_data[1].v.toString().replace(/\"/g,""); //";
			
			result[id] = _.reduce(row_data,function(result,col_data){
				// keyがない列は飛ばす
				if(all_data[TYPE_COL][col_data.col] == undefined || all_data[KEY_COL][col_data.col] == undefined) return result
				
				var key = all_data[KEY_COL][col_data.col].v.toString().replace(/\"/g,""); //"
				var type = all_data[TYPE_COL][col_data.col].v.toString().replace(/\"/g,""); //"
				var val = col_data.v.toString().replace(/\"/g,""); //";
				if(type == "int")    val = parseInt(val);
				if(type == "string") val = val.toString();
				
				// key[index] の形だったときに配列化
				var is_array = ( !!key.match(/\[/) )
				if(is_array){
					var index = parseInt( key.match(/\[.*/)[0].replace("[","").replace("]","") );
					key = key.replace(/\[.*/,"");
					if(!result[key]) result[key] = [];
					result[key][index] = val;
				}else{
					result[key] = val;
				}
				
				return result
			},{});
			return result
		},{})
		
		//grunt.file.write(output_dir + sheet_name + ".json", JSON.stringify(json_data) )
		fs.writeFile(output_dir + sheet_name + ".json", JSON.stringify(json_data) , function (err) {
			//console.log(err);
		});
	}
	
	var xlsToJSON = function(file_name){
		
		// データ用意
		ExcelData = xlsjs.readFile(input_dir + file_name)
		for(var i in ExcelData.SheetNames){
			if(typeof ExcelData.SheetNames[i] == "string" && !ExcelData.SheetNames[i].match(/[^0-9a-zA-Z\ \_\-\+\,\~\=\!\{\}\[\]]/) ){
				sheet_name = ExcelData.SheetNames[i];
				sheet = ExcelData.Sheets[sheet_name]
				range = sheet["!ref"]
				sheet = _.omit(sheet,"!range");
				sheet = _.omit(sheet,"!ref");
				xlsSheetToJSON(sheet_name,sheet)
			}
		}
	}
	
	var convertXlsToJSON = function(){
		var start_time = Date.now();
		
		fs.readdir(input_dir, function(nazo, files){
			for(var i in files){
				var file_name = files[i];
				if(typeof files[i] == "string" && file_name.match(/\.xls/)){
					console.log("convert: " + file_name)
					xlsToJSON(file_name)
				}
			}
			console.log( "完了 :" + (Date.now() - start_time)/1000 + "秒" )
		})
		
		/*
		grunt.file.recurse(input_dir, function(file_path, dir, nazo, file_name){
			if( !file_name.match(/\.xls/) ) return
			console.log("convert: " + file_name)
			xlsToJSON(file_name)
		})
		console.log( (Date.now() - start_time)/1000 + "秒" )
		*/
	}
	
	xls2json = convertXlsToJSON;
})()
