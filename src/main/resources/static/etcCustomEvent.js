
// 전역, 정보 저장용
var repoObj = {};

(function($) {
    "use strict"
    
    $(document).ready(function() {
        divolteLoadStatus();
        dataqulityButtonSetting();
    }); 
})(jQuery);

// Hashmap
class Hashmap {
    constructor() {
        this._storage = [];
    }

    hashStr(str) {
        let finalHash = 0;
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            finalHash += charCode;
        }
        return finalHash;
    }

    set(key, val) {
        let idx = this.hashStr(key);

        if (!this._storage[idx]) {
            this._storage[idx] = [];
        }

        this._storage[idx].push([key, val]);
    }

    get(key) {
        let idx = this.hashStr(key);

        if (!this._storage[idx]) {
            return undefined;
        }

        for (let keyVal of this._storage[idx]) {
            if (keyVal[0] === key) {
                return keyVal[1];
            }
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 메인화면에 메타데이터 메뉴 삽입을 위한 DOM 변화 감지
async function dataqulityButtonSetting() {
    // http://localhost:9171/#/home/preparations/Lw==
    // http://localhost:9171/#/playground/preparation?prepid=dcceee5b-cda1-431f-bae6-426203123607
    let el = jQuery("#side-panel-nav-datasets");
    let tryCount = 0;
    const url = "http://localhost:9172/Metadata/regexes";
    
    //while(100 > tryCount && !el[0]) {
    while(!el[0]) {        
        await sleep(500);
        
        el = jQuery("#side-panel-nav-datasets");
        //tryCount++;
    }
    
    if((el[0])) {
        el.after("<li id=\"side-panel-nav-dataqulity\" class=\"\"><a role=\"link\" label=\"메타데이터\"><i class=\"talend-datastore\"></i><p>메타데이터</p></a></li>");
        
        el.next("li").find("a").off("click").on("click", function() {
            var newTab = window.open(url, "_blank");
            newTab.focus();
        });
        
        let targetNode = document.getElementsByClassName("main-layout");
        while(!targetNode[0]) {        
            await sleep(500);
            
            el = document.getElementsByClassName("main-layout");
        }        
        
        const config = { attributes: true, childList: true, subtree: true };
        
        // 옵션 설명
        // - childList : 대상 노드의 하위 요소가 추가되거나 제거되는 것을 감지합니다.
        // - attributes : 대상 노드의 속성 변화를 감지합니다.
        // - characterData : 대상 노드의 데이터 변화를 감지합니다.
        // - subtree : 대상의 하위의 하위의 요소들까지의 변화를 감지합니다.
        // - attributeOldValue : 변화 이전의 속성 값을 기록합니다.
        // - characterDataOldValue : 변화 이전의 데이터 값을 기록합니다.
        // - attributeFilter : 모든 속성의 변화를 감지할 필요가 없는 경우 속성을 배열로 설정합니다.
         
        // 변화가 감지될 때 실행할 콜백 함수
        const callback = async function(mutationsList, observer) {
            let flag = false;
            
            for(var i = 0, len = mutationsList.length; i < len; i++) {                  
                let mutation = mutationsList[i];

                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    flag = true;
                    break;
                }
            }
            
            if(flag) {
                observer.disconnect();
                
                targetNode = document.getElementsByClassName("main-layout");
                while(!targetNode[0]) {        
                    await sleep(500);
                    
                    el = document.getElementsByClassName("main-layout");
                }
                                   
                observer = new MutationObserver(callback);
                observer.observe(targetNode[0], config);
                
                let el = jQuery("#side-panel-nav-datasets");
                let addedEl = jQuery("#side-panel-nav-dataqulity");
                if(el[0] && !addedEl[0]) {
                    el.after("<li id=\"side-panel-nav-dataqulity\" class=\"\"><a role=\"link\" label=\"메타데이터\"><i class=\"talend-datastore\"></i><p>메타데이터</p></a></li>");
                    
                    el.next("li").find("a").off("click").on("click", function() {
                        var newTab = window.open(url, "_blank");
                        newTab.focus();
                    });

                    var keys = Object.keys(repoObj);
                    for(var i = 0, len = keys.length; i < len; i++) {
                        // 2개 항목값은 제외
                        if("hMap" != keys[i] && "divolteLoadStatus" != keys[i]) {
                            delete repoObj[keys[i]];
                        }
                    }                         
                }
            }               
        };
         
        // 콜백 함수가 연결된 옵저버 인스턴스를 생성합니다.
        let observer = new MutationObserver(callback);
         
        // 선택한 노드의 변화 감지를 시작합니다.
        observer.observe(targetNode[0], config);
         
        // 아래와 같이, 나중에 관찰을 멈출 수 있습니다.
        //observer.disconnect();            
    }
}

// divolte 서비스 사용에 따른 스크립트 로드 여부 확인, 로드된 경우 true
async function divolteLoadStatus() {
    let tryCount = 0;
    while(100 > tryCount && typeof divolte == "undefined") {
        await sleep(100);
        tryCount++;
    }    
    
    if (typeof divolte == "undefined") {
        repoObj.divolteLoadStatus = false;
    }
    else {
        repoObj.divolteLoadStatus = true;
        fnReady();
    }
}

// divolte 스크립트 로드에 따른 UI 이벤트 전송 및 메뉴 데이터 셋팅.
async function fnReady() {
    recipeRemoveIcon();

    jQuery("body").on("click dblclick", function(e) {
        eventHandler(e);
    });

    // 컬럼별 메타 데이터 저장을 위해 (메타 정보가 이미 스크립트 오브젝트에 들어 있을것이라 판단은 되나 해당 오브젝트를 모르기 때문에)
    var s_ajaxListener = new Object();
    s_ajaxListener.tempOpen = XMLHttpRequest.prototype.open;
    s_ajaxListener.tempSend = XMLHttpRequest.prototype.send;
    s_ajaxListener.callback = function() {
        // this.method :the ajax method used
        // this.url    :the url of the requested script (including query string, if any) (urlencoded) 
        // this.data   :the data sent, if any ex: foo=bar&a=b (urlencoded)
        //console.log("callback =====");
        //console.log(this.method);
        //console.log(this.url);

        try {
            var json = JSON.parse(this.data);
            if (json.id) {
                repoObj[json.id] = json;
                //console.log(repoObj);
            } else {
                //console.log(this.data);
            }
        } catch (e) {
            //console.log(this.data);
        }
    }

    XMLHttpRequest.prototype.open = function(a, b) {
        //console.log("open =====");
        //console.log(this);
        //console.log(arguments);

        if (!a) var a = '';
        if (!b) var b = '';
        s_ajaxListener.tempOpen.apply(this, arguments);
        s_ajaxListener.method = a;
        s_ajaxListener.url = b;
        if (a.toLowerCase() == 'get') {
            s_ajaxListener.data = b.split('?');
            s_ajaxListener.data = s_ajaxListener.data[1];

            //console.log(s_ajaxListener.data);
        }
    }

    XMLHttpRequest.prototype.send = function(a, b) {
        //console.log("send =====");
        //console.log(this);
        //console.log(arguments);

        if (!a) var a = '';
        if (!b) var b = '';

        s_ajaxListener.tempSend.apply(this, arguments);
        if (s_ajaxListener.method.toLowerCase() == 'post') s_ajaxListener.data = a;
        s_ajaxListener.callback();
    }

    // UI 이벤트 영역 판별용
    async function eventHandler(e) {
        var targetObj = jQuery(e.target);

        var preparation_name = jQuery("span.header-preparation-name").text();
        var divolteEventType = "";

        if (e.target.nodeName == "DIV") {
            var headerObj = targetObj.closest("[id^='slickgrid_']");
            var cellObj = targetObj.parent();

            var row_id = null;
            var column_no = null;
            var column = null;
            var column_id = null;
            var column_title = null;
            var column_type = null;
            var column_domain = null;
            var cell_value_1 = null;

            // 헤더
            if (headerObj[0] && !headerObj.hasClass("frozen")) {
                divolteEventType = "header_click";

                row_id = "0";
                column_no = jQuery("div.ui-state-default.slick-header-column").index(headerObj);
                column_id = headerObj.attr("id").replace(/^\w+\d(?=\d{4})/g, "");
                column_title = jQuery.trim(headerObj.find(".grid-header-title").text());
                column_type = headerObj.find(".grid-header-type").text();
            }
            // 셀
            else if (cellObj.hasClass("slick-cell") && !cellObj.hasClass("frozen")) {
                divolteEventType = "cell_click";

                row_id = jQuery("div.ui-widget-content.slick-row.active:visible").find(".index-cell").text();
                column_no = cellObj[0].className.match(/l\d{1}/g)[0].replace("l", "");
                column = jQuery("div.ui-state-default.slick-header-column").eq(column_no);
                column_id = column.attr("id").replace(/^\w+\d(?=\d{4})/g, "");
                column_title = jQuery.trim(column.find(".grid-header-title").text());
                column_type = column.find(".grid-header-type").text();
                cell_value_1 = targetObj.text();            
            }
            // 우측 상단 레시피 메뉴
            else if(targetObj.closest("sc-accordion-item")[0]) {
                divolteEventType = "right_top_recipe_add";

                var header = jQuery.trim(jQuery("actions-suggestions").find(".tabs-header.active").text());
                var row_id = jQuery("div.ui-widget-content.slick-row.active:visible").find(".index-cell").text();
                var menu_name = targetObj.closest("sc-accordion-item").find(".trigger-label").text().replace(/\.+/, "");

                if (header == "열") {
                    column_no = jQuery("div.slick-cell.active")[0].className.match(/l\d{1}/g)[0].replace("l", "");
                    column = jQuery("div.ui-state-default.slick-header-column").eq(column_no);
                    column_id = column.attr("id").replace(/^\w+\d(?=\d{4})/g, "");
                    column_title = jQuery.trim(column.find(".grid-header-title").text());
                    column_type = column.find(".grid-header-type").text();
                    cell_value_1 = jQuery("div.slick-cell.active").text();
                }
            }

            if("" != jQuery.trim(row_id)) {
                column_type = column_type.toLowerCase();

                if(repoObj[column_id]) {
                    column_domain = repoObj[column_id].domain;
                    column_type = repoObj[column_id].type;
                }
                else if (!("any" == column_type || "string" == column_type || "boolean" == column_type || "date" == column_type || "utc_datetime" == column_type || "numeric" == column_type || "double" == column_type || "double" == column_type || "float" == column_type)) {
                    column_domain = _.clone(column_type);
                    column_type = "";
                }

                console.log("preparation_name : " + preparation_name +  " / row_id : " + row_id + " / column_no : " + column_no + " / cell_value_1 : " + cell_value_1 + " / column_id : " + column_id + " / column_title : " + column_title + " / column_type : " + column_type + " / column_domain : " + column_domain + " / menu_name : " + menu_name);

                divolte.signal(divolteEventType, {
                    "preparation_name": preparation_name,
                    "row_id": row_id,
                    "column_no": column_no,
                    "column_id": column_id,
                    "column_title": column_title,
                    "column_type": column_type,
                    "column_domain": column_domain,
                    "cell_value_1": cell_value_1,
                    "menu_name": menu_name
                });
            }
        }
        // 좌측 레시피 삭제
        else if (e.target.nodeName == "REMOVE-ICON-CLICK") {
            var step_description = targetObj.closest("li.as-sortable-item").find("step-description");
            var step_no = step_description.find(".step-number").text();
            var step_scope = step_description.find(".step-scope")[0];
            if(step_scope) {
                step_scope = "column";
            }
            else {
                step_scope = "cell";
            }
            var step_label = step_description.find(".step-label").text();
            var step_id = targetObj.prev("a").attr("id").replace("step-remove-", "");

            console.log("preparation_name : " + preparation_name +  " / step_no : " + step_no + " / step_scope : " + step_scope + " / step_label : " + step_label + " / step_id : " + step_id);

            divolte.signal("left_recipe_delete", {
                "preparation_name": preparation_name,
                "step_description": step_description,
                "step_no": step_no,
                "step_scope": step_scope,
                "step_label": step_label,
                "step_id": step_id
            });
        }        
        else if (e.target.nodeName == "LI") {
            //
            if(targetObj.parent().hasClass("submenu")) {
                return false;
            }
            // 우측 하단 (그외는 상단 열/행 탭)
            else if(!targetObj.closest("actions-suggestions")[0]) {
                var menu_name = jQuery.trim(targetObj.text());

                divolte.signal("right_bottom_grape", {
                    "menu_name": menu_name
                });                
            }

            console.log("preparation_name : " + preparation_name +  " / menu_name : " + menu_name);
        }
        else if (e.target.nodeName == "BUTTON" && targetObj.closest(".step-parameters-list")[0]) {
            var step_description = targetObj.closest("li.as-sortable-item").find("step-description");
            var step_no = step_description.find(".step-number").text();
            var step_scope = step_description.find(".step-scope").text();
            if("" == step_scope) step_scope = "칸";
            var step_label = step_description.find(".step-label").text();
            var step_id = targetObj.closest(".as-sortable-item").find(".remove-icon").attr("id").replace("step-remove-", "");

            console.log("preparation_name : " + preparation_name +  " / step_no : " + step_no + " / step_scope : " + step_scope + " / step_label : " + step_label + " / step_id : " + step_id);

            divolte.signal("left_recipe_change", {
                "preparation_name": preparation_name,
                "step_description": step_description,
                "step_no": step_no,
                "step_scope": step_scope,
                "step_label": step_label,
                "step_id": step_id
            });            
        }
    }

    // 상세화면 좌측 레시피 삭제시 (해당 이벤트는 angular가 동적으로 만들어주는것으로 보이며, click 이벤트에 정상적으로 잡히지 않기 때문에 DOM을 변경하여 돌아갈 수 있게함.)
    // 마찬가지로 DOM의 변경을 감지하여 레시피가 추가될때도 동일하게 작업해줌.
    async function recipeRemoveIcon() {
        // http://localhost:9171/#/playground/preparation?prepid=dcceee5b-cda1-431f-bae6-426203123607
        let el = jQuery("a.remove-icon");
        let tryCount = 0;
        
        //while(100 > tryCount && !el[0]) {
        while(!el[0]) {
            await sleep(500);
            
            el = jQuery("a.remove-icon");
            //tryCount++;
        }

        if((el[0])) {
            el.each(function(idx, obj) {
                jQuery(obj).attr("onclick", "eventHandlerDummy(this);");
                jQuery(obj).after("<remove-icon-click style=\"flex-basis:0px;\"></remove-icon-click>");
            });
            
            let targetNode = jQuery("recipe").find("ul")[0];
            while(!targetNode) {
                await sleep(500);
                
                targetNode = jQuery("recipe").find("ul")[0];
            }            
            const config = { attributes: true, childList: true, subtree: true };
            
            // 옵션 설명
            // - childList : 대상 노드의 하위 요소가 추가되거나 제거되는 것을 감지합니다.
            // - attributes : 대상 노드의 속성 변화를 감지합니다.
            // - characterData : 대상 노드의 데이터 변화를 감지합니다.
            // - subtree : 대상의 하위의 하위의 요소들까지의 변화를 감지합니다.
            // - attributeOldValue : 변화 이전의 속성 값을 기록합니다.
            // - characterDataOldValue : 변화 이전의 데이터 값을 기록합니다.
            // - attributeFilter : 모든 속성의 변화를 감지할 필요가 없는 경우 속성을 배열로 설정합니다.
             
            // 변화가 감지될 때 실행할 콜백 함수
            const callback = async function(mutationsList, observer) {
                let flag = false;
                
                for(var i = 0, len = mutationsList.length; i < len; i++) {                  
                    let mutation = mutationsList[i];

                    if (mutation.type === 'childList' || mutation.type === 'attributes') {
                        flag = true;
                        break;
                    }
                }
                
                if(flag) {
                    observer.disconnect();
                    
                    targetNode = jQuery("recipe").find("ul")[0];
                    while(!targetNode) {
                        await sleep(500);
                        
                        targetNode = jQuery("recipe").find("ul")[0];
                    }
                    
                    observer = new MutationObserver(callback);
                    observer.observe(targetNode, config);
                    
                    let el = jQuery("recipe").find("li a");
                    if(el[0]) {
                        el.each(function(idx, obj) {
                            if(!jQuery(obj).next("remove-icon-click")[0]) {
                                jQuery(obj).attr("onclick", "eventHandlerDummy(this);");
                                jQuery(obj).after("<remove-icon-click style=\"flex-basis:0px;\"></remove-icon-click>");
                            }
                        });                 
                    }
                }               
            };
             
            // 콜백 함수가 연결된 옵저버 인스턴스를 생성합니다.
            let observer = new MutationObserver(callback);
             
            // 선택한 노드의 변화 감지를 시작합니다.
            observer.observe(targetNode, config);
             
            // 아래와 같이, 나중에 관찰을 멈출 수 있습니다.
            //observer.disconnect();            
        }
        else {
            var keys = Object.keys(repoObj);
            for(var i = 0, len = keys.length; i < len; i++) {
                // 2개 항목값은 제외
                if("hMap" != keys[i] && "divolteLoadStatus" != keys[i]) {
                    delete repoObj[keys[i]];
                }
            }   
        }
    }

    const hMap = new Hashmap();
    hMap.set("delete", "행 삭제");
    hMap.set("make_line_header", "해더로 만들기");
    hMap.set("replace_cell_value", "셀 값 변경");
    hMap.set("negate", "부정값");
    hMap.set("date_calendar_converter", "날짜 변환");
    hMap.set("extract_date_tokens", "날짜 부분 추출(열 생성)");
    hMap.set("compare_dates", "날짜 비교");
    hMap.set("modify_date", "날짜 수정");
    hMap.set("change_date_pattern", "날짜 형식 변경");
    hMap.set("compute_time_since", "입력한 때까지의 시간을 계산합니다");
    hMap.set("timestamp_to_date", "타입스탬프를 날짜로 계산합니다");
    hMap.set("mask_data_by_domain", "데이터 난독화");
    hMap.set("hash_data", "해시 데이터");
    hMap.set("standardize_value", "값 표준화(퍼지 매칭)");
    hMap.set("clear_invalid", "무효값지우기");
    hMap.set("fillinvalidwithdefault", "무효값채우기");
    hMap.set("delete_invalid", "무효값이 있는 행 삭제");
    hMap.set("fill_empty_from_above", "빈 값을 위값으로 채우기");
    hMap.set("fillemptywithdefault", "빈값 채우기");
    hMap.set("delete_empty", "빈값이 있는 행 삭제");
    hMap.set("delete_negative_values", "음수 값이 있는 행 제거");
    hMap.set("clear_matching", "일치하는 값 지우기");
    hMap.set("delete_on_value", "일치하는 행 삭제");
    hMap.set("fill_with_value", "지정값 채우기");
    hMap.set("compute_length", "길이 계산");
    hMap.set("propercase", "단어 철글자를 대문자로 변경");
    hMap.set("uppercase", "대문자로 변경");
    hMap.set("replace_on_value", "바꾸기");
    hMap.set("lowercase", "소문자로 변경");
    hMap.set("remove_repeated_chars", "연속 문자 제거");
    hMap.set("fuzzy_matching", "유사한 텍스트 일치");
    hMap.set("substring", "텍스트 부분 추출");
    hMap.set("contains", "텍스트 포함 (True, False)");
    hMap.set("cut", "텍스트 일부를 제거");
    hMap.set("matches_pattern", "패턴 일치");
    hMap.set("trim", "후행 및 선행문자 제거");
    hMap.set("remove_non_num_chars", "숫자가 아닌 문자 제거");
    hMap.set("remove_non_alpha_num_chars", "알파벳 숫자가 아닌 문자 제거");
    hMap.set("padding", "여분의 문자 추가");
    hMap.set("normalize", "텍스트 단순화(제거 사례, 강조 등)");
    hMap.set("distance_converter", "거리 변환");
    hMap.set("duration_converter", "기간 변환");
    hMap.set("temperatures_converter", "온도 변환");
    hMap.set("extract_url_tokens", "URL 추출");
    hMap.set("extract_string_tokens", "문자열 추출");
    hMap.set("split", "분리 기호를 기준으로 분리");
    hMap.set("extract_number", "숫자 추출");
    hMap.set("extractemaildomain", "이메일 부분 추출(@ 기준)");
    hMap.set("logarithm_numbers", "Base 10 로그");
    hMap.set("pow_numbers", "거듭제곱");
    hMap.set("modulo", "나머지");
    hMap.set("numeric_ops", "더하기,곱하기,빼기,나누기");
    hMap.set("negate_numbers", "부호반전");
    hMap.set("sin_numbers", "사인");
    hMap.set("natural_logarithm_numbers", "자연 로그");
    hMap.set("absolute", "절대값 계산");
    hMap.set("square_root_numbers", "제곱근");
    hMap.set("exponential_numbers", "지수의");
    hMap.set("max_numbers", "최대");
    hMap.set("min_numbers", "최소");
    hMap.set("cos_numbers", "코사인");
    hMap.set("tan_numbers", "탄젠트");
    hMap.set("round_down_real", "내림");
    hMap.set("round", "반올림");
    hMap.set("floor", "버림");
    hMap.set("round_down", "소수점 제거");
    hMap.set("change_number_format", "숫자 서식 지정");
    hMap.set("compare_numbers", "열 비교");
    hMap.set("ceil", "올림");
    hMap.set("remove_negative_values", "음수값 제거");
    hMap.set("generate_a_sequence", "일련번호 생성");
    hMap.set("concat", "문자열 연결");
    hMap.set("swap_column", "열 교환");
    hMap.set("delete_column", "열 삭제");
    hMap.set("create_new_column", "새열 생성");
    hMap.set("copy", "열 복사");
    hMap.set("rename_column", "열이름 변경");
    hMap.set("domain_change", "의미 영역 변경");
    hMap.set("copy_nlp", "자연어 처리");
    hMap.set("type_change", "타입 변경");
    hMap.set("replace_nlp_on_value", "자연어 처리");
    hMap.set("extract_phone_information", "전화 번호 정보 추출");
    hMap.set("format_phone_number", "전화 번호 형식");
    hMap.set("delete_lines", "필터링 된 행들 삭제");
    hMap.set("keep_only", "필터링 된 행들 유지");
    repoObj.hMap = hMap;
}

function eventHandlerDummy(that) {
    jQuery(that).next("remove-icon-click").trigger("click");
}

// 실제 Dprep 이 비동기로 url 을 호출할때 추가로 호출할 부분 (vendor-...js 아래 k.send 에서 호출)
function apiCallInfoSendToDivolte(method, url, params) {
    if (typeof repoObj.divolteLoadStatus == "boolean" && repoObj.divolteLoadStatus) {
        if ("POST" == method || "PUT" == method) {
            // 일부 url 제외 
            // http://localhost:9171/api/transform/suggest/column
            // http://localhost:9171/api/transform/actions/column
            // http://localhost:9171/api/preparations/preview/add
            // http://localhost:9171/api/datasets?name=sample
            // http://49.50.172.155:9171/api/preparations?folder=Lw==
            if (/^http:\/\/[\w\.]+[\:\w]*\/api\/transform\/suggest\/column/g.test(url) 
             || /^http:\/\/[\w\.]+[\:\w]*\/api\/transform\/actions\/column/g.test(url)
             || /^http:\/\/[\w\.]+[\:\w]*\/api\/preparations\/preview\/add/g.test(url)
             || /^http:\/\/[\w\.]+[\:\w]*\/api\/datasets\?name\=\w+/g.test(url)
             || /^http:\/\/[\w\.]+[\:\w]*\/api\/preparations\?folder\=Lw\=\=/g.test(url)) {
                return;
            }
            
            var json = null;
            try {
                json = JSON.parse(params).actions[0];
            }
            catch(e) {
                console.dir(params);
                return;
            }

            var divolteEventType = json.action
            var preparation_name = jQuery("span.header-preparation-name").text();
            var parameters = json.parameters;
            var row_id = parameters.row_id;
            var column_no = null;
            var columns = jQuery("div.ui-state-default.slick-header-column");
            columns.each(function(idx, column) {
                if (jQuery(column).hasClass("selected")) {
                    column_no = idx;
                    return false;
                }                                    
            });
            var column_id = parameters.column_id;
            var column_title = parameters.column_name;
            var column_type = null;
            var column_domain = null;
            if(repoObj[column_id]) {
                column_type = repoObj[column_id].type;
                column_domain = repoObj[column_id].domain;
            }
            else {
                column_type = columns.eq(column_no).find(".grid-header-type").text().toLowerCase();

                if (!("any" == column_type || "string" == column_type || "boolean" == column_type || "date" == column_type || "utc_datetime" == column_type || "numeric" == column_type || "double" == column_type || "double" == column_type || "float" == column_type)) {
                    column_domain = _.clone(column_type);
                    column_type = "";
                }                                    
            }
            var cell_value_1 = null;
            var cell_value_2 = null;
            
            if (parameters.original_value) {
                cell_value_1 = parameters.original_value;
                cell_value_2 = parameters.new_value;
            }
            else if (parameters.constant_value) {
                cell_value_1 = parameters.constant_value;
            }
            else if (parameters.default_value) {
                cell_value_1 = parameters.default_value;
            }
            else if (parameters.matching_value) {
                cell_value_1 = parameters.matching_value.token;
            }
            else if (parameters.value) {
                cell_value_1 = parameters.value.token;
            }            
            else if (parameters.cell_value) {
                cell_value_1 = parameters.cell_value.token;
                cell_value_2 = parameters.replace_value;
            }            
            else if (parameters.reference_value) {
                cell_value_1 = parameters.reference_value;
            }
            else if (parameters.start_value) {
                cell_value_1 = parameters.start_value;
                cell_value_2 = parameters.step_value;
            }
            
            var menu_name = null;
            if (repoObj.hMap) {
                menu_name = repoObj.hMap.get(divolteEventType);
            }                

            var step_no = $("recipe").find(".as-sortable-item").length + 1;
            var step_label = _.clone(menu_name);
            var step_scope = parameters.scope || null;
            
            console.log("preparation_name : " + preparation_name +  " / row_id : " + row_id + " / column_no : " + column_no + " / cell_value_1 : " + cell_value_1 + " / cell_value_2 : " + cell_value_2 + " / column_id : " + column_id + " / column_title : " + column_title + " / column_type : " + column_type + " / column_domain : " + column_domain + " / menu_name : " + menu_name + " / step_no : " + step_no + " / step_label : " + step_label + " / step_scope : " + step_scope);

            divolte.signal(divolteEventType, {
                "preparation_name": preparation_name,
                "row_id": row_id,
                "column_no": column_no,
                "column_id": column_id,
                "column_title": column_title,
                "column_type": column_type,
                "column_domain": column_domain,
                "cell_value_1": cell_value_1,
                "cell_value_2": cell_value_2,
                "menu_name": menu_name,
                "parameters": JSON.stringify(parameters),
                "step_no": step_no,
                "step_label": step_label,
                "step_scope": step_scope
            });
        }
        else if ("DELETE" == method) {
            var stepId = url.replace(/^http:\/\/\w+:*\d*\/api\/preparations\/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}\/actions\//g, "");
            
            console.log(stepId);
        }
    }    
}