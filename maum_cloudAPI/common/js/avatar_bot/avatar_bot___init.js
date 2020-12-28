let engine_groups = new Array();
let engines = new Array();



/*
** 엔진 그룹 로딩
*/
loadEngineGroup();
function loadEngineGroup() {
    $.ajax({
        type:"GET",
        url: url___mvp_maker + "/mvp/api/EngineGroups",
        success: function(result){
            console.log("엔진 그룹 조회 성공");
            console.dir(result);

            engine_groups = result;
            for(let xx = 0; xx < engine_groups.length; xx++) {
                loadEngineListByGroup(engine_groups[xx]);
            }
        },
        error: function(xhr, status, error) {
            console.log(xhr.toString());
            console.log(status.toString());
            console.log(error.toString());
        }
    });
}

function loadEngineListByGroup(group) {
    $.ajax({
        type:"GET",
        url: url___mvp_maker + "/mvp/api/EngineGroups/"+ group.groupId,

        success: function(result){
            for(let xx = 0; xx < result.length; xx++) engines[result[xx].engineId] = result[xx];
        },
        error: function(xhr, status, error) {
            console.log(xhr.toString());
            console.log(status.toString());
            console.log(error.toString());
        }
    });
}



/*
** FLOW 로딩
*/
function loadFlow(flows, index, flow_id) {
    $.ajax({
        type:"GET",
        url: url___mvp_maker + "/mvp/api/Flows/" + flow_id,
        success: function(result){
            console.log("플로우 조회 성공");
            console.dir(result);
            flows[index] = result;
        },
        error: function(xhr, status, error) {
            console.log(xhr.toString());
            console.log(status.toString());
            console.log(error.toString());

            flows[index] = null;
        }
    });
}

