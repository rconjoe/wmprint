const http = require("http");
const { exec } = require("child_process");

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/") {
    let body = "";

    // Accumulate the data chunks received in the request body
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        // Parse the JSON object from the request body
        const data = JSON.parse(body);

        // Execute the echo command with the interpolated string
        exec(`/home/trog/wmprint/printerror "${data.name}" "${data.message}" "${data.reason}" "${data.canceler}"`, (error, stdout, stderr) => {
          if (error) {
            res.writeHead(500);
            res.end(`Server error: ${error.message}`);
            return;
          }

	  res.writeHead(200)
	  res.end('ok')
		return;
        });
      } catch (error) {
        // Handle JSON parsing error or other errors
        res.writeHead(400);
        res.end(`Bad request: ${error.message}`);
      }
    });
  } else {
    // Handle any non-POST requests or other endpoints
    res.writeHead(404);
    res.end("Not found");
  }
});

const PORT = 8000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

