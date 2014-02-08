angular.module("MyApp")
    .service('componentGenerator', function(){


        this.generateComponent = function(obj,options)
        {
            if(obj.ignore)
            {
                return "";
            }
            
            var temp = "";
            temp = "<a><h4>"+obj.label+"</h4></a>";
            switch (obj.controltype)
            {
                case "colorpicker":
                   temp += "<span colorpicker ng-model="+obj.name+" style='background-color: "+obj.name+"' ng-change = \"view."+obj.func+"(colorAcessorGen("+obj.name+"))\"class='btn btn-primary'>Change color</span>"
                break;
                case "bool":
                    temp += "<input type=\"checkbox\"  ng-change = \""+obj.func+"("+obj.name+")\"ng-model=\""+obj.name+"\"><br>"
                    break;
                case "range":
                    temp += "<input type=\"range\" min=\""+obj.options.min+"\" max=\""+obj.options.max+"\" value= '"+obj.options.default+"' ng-change = \""+obj.func+"("+obj.name+")\"ng-model=\""+obj.name+"\"step='"+obj.options.step+"'><br>" //name=\""+obj.name+"\"
                    break;
                case "select":
                    temp += "<select ng-change = \""+obj.func+"("+obj.name+")\" ng-model=\""+obj.name+"\" >";
                    for(var j in options)
                    {
                        if((options[j].returnType === obj.datatype)||obj.datatype=="character")
                        temp += "<option value=\""+j+"\">"+j+"</option>"
                    }
                    temp += "</select>";
                    break;
            }
            temp +="<br>"
            return temp;
        }
        this.genControls = function(data)
        {
            var temp = ""
            for(var i =0;i<data.length;i++)
            {
                temp += this.generateComponent(data[i]);
            }

            return temp;
        };
        this.generateSidebar = function (data,acessorFns){
            var temp =  "<tabset justified=\"true\">";
            var tabTitles = [];
            for(var i =0;i<data.length;i++)
            {
                if(tabTitles.indexOf(data[i].tab)===-1)
                {
                    if(tabTitles.length!==0)
                    {
                        temp += "</tab >";
                    }
                   
                     temp += "<tab ><tab-heading><span class=\"text-info small\">"+data[i].tab+"</span></tab-heading>";
                     tabTitles.push(data[i].tab);
                }
                temp += this.generateComponent(data[i],acessorFns[data[i].tab]);
            }
            temp += "</tab >";
            temp+=    "</tabset>";
            return temp;
        };
    })