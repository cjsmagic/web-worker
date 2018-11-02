var app = angular.module("webWorkerApp", []);
app.controller("webWorkerCtrl", function($scope, $interval) {
  $scope.timer = 0;
  $scope.resultStatus = "Dint start yet!";
  $scope.tasksArray = [];

  let intervalInstance = null;
  let worker = null;

  const SINGLE_TASK_DONE = "SINGLE_TASK_DONE";
  const ALL_TASK_DONE = "ALL_TASK_DONE";
  const START_API_JOB = "START_API_JOB";

  init();
  ///////////functions/////////////
  function init() {
    //register web worker
    worker = new Worker("web-worker.js"); // create our worker

    worker.onmessage = event => {
      if (event.data) {
        result.innerText = "data processed!";

        switch (event.data.name) {
          case SINGLE_TASK_DONE:
            processSingleTaskDone(event.data.taskInfo);
            break;
          case ALL_TASK_DONE:
            $interval.cancel(intervalInstance);
            break;
        }
      }
    };
  }

  function buildTaskArray() {
    for (let i = 1; i <= 10; i++) {
      let taskItem = {
        id: "task__" + i,
        status: "Initial"
      };
      $scope.tasksArray.push(taskItem);
    }

    return angular.copy($scope.tasksArray);
  }

  function processSingleTaskDone(taskInfo) {
    console.log("single task done", taskInfo.id, taskInfo.status);

    $scope.tasksArray.forEach((item, index, self) => {
      if (taskInfo.id == item.id) {
        self[index] = taskInfo;
      }
    });
  }

  $scope.sendMessageToWorker = () => {
    let tasks = buildTaskArray();

    let message = {
      name: START_API_JOB,
      tasks
    };

    worker.postMessage(message); // post a message to our worker

    $scope.timer = 0;
    intervalInstance = $interval(function() {
      $scope.timer++;
    }, 1000);
  };
});
