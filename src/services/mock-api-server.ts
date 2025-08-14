import { createServer } from "http";

const data = {
  questions: [
    {
      id: 1,
      expression: ["grin", "grin", "grin"],
      result: 30,
    },
    {
      id: 2,
      expression: ["grin", "side-eyes", "side-eyes"],
      result: 18,
    },
    {
      id: 3,
      expression: ["side-eyes", "pumpkin"],
      result: 2,
    },
    {
      id: 4,
      expression: ["pumpkin", "grin", "side-eyes"],
      result: null,
    },
  ],
};

const server = createServer((req, res) => {
  if (req.url === "/api/questions") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  } else {
    res.writeHead(404);
    res.end();
  }
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(
    `Mock API server running at http://localhost:${PORT}/api/questions`,
  );
});
