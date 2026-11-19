import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { createServer } from "../server.js";

let server;
let port;

before(async () => {
    server = createServer();
    await new Promise((resolve) => server.listen(0, resolve));
    port = server.address().port;
});

after(() => new Promise((resolve) => server.close(resolve)));

function get(path, method = "GET") {
    return new Promise((resolve, reject) => {
        http.request({ port, path, method }, (res) => {
            let body = "";
            res.on("data", (chunk) => (body += chunk));
            res.on("end", () => resolve({ status: res.statusCode, type: res.headers["content-type"], body }));
        }).on("error", reject).end();
    });
}

test("головна сторінка та файли клієнта віддаються", async () => {
    for (const p of ["/", "/index.html", "/script.js", "/style.css", "/localStorageAdapter.js"]) {
        assert.equal((await get(p)).status, 200, p);
    }
    assert.match((await get("/")).type, /text\/html/);
});

test("файли ядра віддаються за адресою /node_modules/@bukvarnia/core/", async () => {
    const res = await get("/node_modules/@bukvarnia/core/index.js");
    assert.equal(res.status, 200);
    assert.match(res.type, /javascript/);
    assert.match(res.body, /bookValidation\.js/);
});

test("server.js і package.json недоступні", async () => {
    assert.equal((await get("/server.js")).status, 404);
    assert.equal((await get("/package.json")).status, 404);
    assert.equal((await get("/node_modules/@bukvarnia/core/package.json")).status, 404);
    assert.equal((await get("/node_modules/@bukvarnia/core/test/bookUtils.test.js")).status, 404);
});

test("вихід за межі теки (../) повертає 404", async () => {
    assert.equal((await get("/node_modules/@bukvarnia/core/../../web/server.js")).status, 404);
    assert.equal((await get("/node_modules/@bukvarnia/core/%2e%2e/package.json")).status, 404);
    assert.equal((await get("/node_modules/@bukvarnia/core/..%2fpackage.json")).status, 404);
});

test("метод, відмінний від GET/HEAD, не приймається", async () => {
    assert.equal((await get("/", "POST")).status, 405);
});
