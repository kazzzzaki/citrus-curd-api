const sendRequest = document.getElementById("sendRequest");
sendRequest.addEventListener("click", async function () {
  document.getElementById("responseJson").innerHTML = "";
  console.log("リクエストを送ります。");
  const requestUrl = document.getElementById("requestURL").value;
  const requestMethod = document.getElementById("requestMethod").value;
  console.log(requestUrl);
  console.log(requestMethod);
  const response = await fetch(requestUrl, { method: requestMethod });
  console.log(response);
  document.getElementById("responseStatus").value = response.status;
  console.log(response);
  if (response.status !== 200) {
    const data = await response.json();
    document.getElementById("responseJson").innerHTML = JSON.stringify(
      data,
      null,
      "\t"
    );
  }
});
