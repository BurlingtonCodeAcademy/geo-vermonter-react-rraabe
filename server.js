const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const fs = require("fs");
const $path = require("path");

const publicDir = $path.resolve("./public");
const serverDir = $path.resolve("./server");

app.get('/scores', (req, res) =>{

})
app.post(
  "/scores", //create my json score object and send
  express.urlencoded({ extended: false }),
  (request, response) => {
    console.log("in the app.post");
    createScore(request.body, response);
    response.redirect("/scores");
  }
);

function createScore(params, response) {
  console.log("In function createScore");
  const score = {
    user: params.user.trim(),
    score: params.score.trim(),
    startingCounty: params.county.trim(),
    date: "July 29, 2019"
  };

  //read file, append, and write
  // let scoreFile = $path.join("/server/scores.json");
  //1st argument = what we're writing to, 2nd argument = what we're writing, 3rd argument is a callback function if an error occurs
  fs.readFile("./server/scores.json", "utf8", function(err, data) {
    if (err) {
      console.log("In the readfile error message");
      console.log(err);
    } else {
      console.log("Found ./server/scores.json");
      const allScores = JSON.parse(data);
      allScores.push(score);

      const updatedScores = JSON.stringify(allScores);

      fs.writeFile("./server/scores.json", updatedScores, "utf8", function(
        err
      ) {
        if (err) {
          console.log(err);
        } else {
          console.log("Maybe it worked?");
        }
      });
      console.log('Right before the redirect')
    }
  });
}
app.listen(port, () => console.log(`Listening on port ${port}!`));
