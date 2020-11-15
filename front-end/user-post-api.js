const sendRequest = document.getElementById("sendRequest");
sendRequest.addEventListener("click", async function (e) {
  console.log("リクエストを送ります。");
  const requestUrl = document.getElementById("requestURL").value;
  const requestMethod = document.getElementById("requestMethod").value;
  const requestName = document.getElementById("requestName").value;
  const requestToken = document.getElementById("requestToken").value;
  let requestBody = {};
  requestBody.name = requestName;
  requestBody.token = requestToken;
  console.log(requestUrl);
  console.log(requestMethod);
  console.log(requestBody);
  const response = await fetch(requestUrl, {
    method: requestMethod,
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(requestBody),
  });
  const data = await response.json();
  document.getElementById("responseStatus").value = response.status;
  if (data !== undefined) {
    document.getElementById("responseJson").innerHTML = JSON.stringify(
      data,
      null,
      "\t"
    );
  }
});
