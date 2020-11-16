const sendRequest = document.getElementById("sendRequest");
sendRequest.addEventListener("click", async function () {
  console.log("リクエストを送ります。");
  const requestUrl = document.getElementById("requestURL").value;
  const requestMethod = document.getElementById("requestMethod").value;
  console.log(requestUrl);
  console.log(requestMethod);
  const response = await fetch(requestUrl, { method: requestMethod });
  const data = await response.json();
  document.getElementById("responseStatus").value = response.status;
  document.getElementById("responseJson").innerHTML = JSON.stringify(
    data,
    null,
    "\t"
  );
});
