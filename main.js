
const secureRPC = "https://jamima-ehu4jt-fast-mainnet.helius-rpc.com/" //limited to 5 TPS per IP

window.onload = async function () {

    let countUI = document.getElementById("count")
    let oldCount = 0

    function animateCountUp(start, end, duration) {
        let startTime = null

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime
            const timeElapsed = currentTime - startTime
            const progress = Math.min(timeElapsed / duration, 1)

            countUI.textContent = Math.floor(progress * (end - start) + start)

            if (timeElapsed < duration) {
                requestAnimationFrame(animation)
            }
        }

        requestAnimationFrame(animation)
    }

    async function updateCount() {
        const newCount = await fetchMCC()
        if (oldCount !== undefined) {
            animateCountUp(oldCount, newCount, 1000)
        } else {
            countUI.textContent = newCount
        }

        oldCount = newCount
    }

    await updateCount()

    setInterval(updateCount, 30000)
}


const fetchMCC = async () => {
  let page = 1
  let mintList = []

  while (page) {
    const response = await fetch(secureRPC, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "my-id",
        method: "getAssetsByGroup",
        params: {
          groupKey: 'collection',
          groupValue: "46pcSL5gmjBrPqGKFaLbbCmR6iVuLJbnQy13hAe7s6CC",
          page: page,
          limit: 1000,
        },
      }),
    })

    const { result } = await response.json()

    for (const nfts of result.items) {
      if (nfts.burnt === false) {
        mintList.push(nfts.id)
      }
    }

    if (result.total !== 1000) {
      page = false
    } else {
      page++
    }
  }
  return mintList.length
}