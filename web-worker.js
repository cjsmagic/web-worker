let count = 0;
let rounds = 0;
let tasks = [];

const SINGLE_TASK_DONE = "SINGLE_TASK_DONE";
const ALL_TASK_DONE = "ALL_TASK_DONE";
const START_API_JOB = "START_API_JOB";

self.onmessage = event => {
  if (event.data.name === START_API_JOB) {
    rounds = 0;
    tasks = event.data.tasks;
    count = tasks.length;

    tasks.forEach(taskItem => {
      apiRequestStart(taskItem);
    });
  }
};

function apiRequestStart(taskItem) {
  const url = "https://swapi.co/api/people";

  fetch(url)
    .then(data => data.json())
    .then(data => {
      console.log("rounds", rounds);

      let message = {
        name: SINGLE_TASK_DONE,
        taskInfo: {
          id: taskItem.id,
          status: "done"
        }
      };

      self.postMessage(message);
      rounds++;
      if (rounds === count) {
        let message = {
          name: ALL_TASK_DONE
        };
        self.postMessage(message);
      }
    })
    .catch(err => {
      console.log("err", err);
      let message = {
        name: SINGLE_TASK_DONE,
        taskInfo: {
          id: taskItem.id,
          status: "failed"
        }
      };

      self.postMessage(message);

      rounds++;
      if (rounds === count) {
        let message = {
          name: ALL_TASK_DONE
        };
        self.postMessage(message);
      }
    });
}
