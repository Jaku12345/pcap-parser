# Browser PCAP analysis tool

Browser packet capture (pcap) file parser and renderer.

# Motivation

During my university semester, I was challenged by a lecturer as a front-end developer to write a pcap parser analysis tool on the browser, since there are none available on the internet. Of course, it would be better performance-wise to parse files on the server rather than the browser, but for smaller pcap files it is possible to conveniently execute. For a 38KB pcap file, it takes less than 2 seconds to parse and be displayed in the graph.

# Features

- **Global Header Properties:** Beneath each graph, Global Header Properties are shown, such as: Beneath each graph, Global Header Properties are shown: Link Layer Type, Magic Number, Max Capture Length, Timestamp Accuracy, Timezone Offset, Version.
- **Victim and attacker pcap file upload:** A graph displays each packet's time on the x-axis, and count on the y-axis. Each packet is labeled with a color, with red meaning severe, yellow - medium, and green - low.
- **Zoom in and click on packet:** A user can click on the graph, zoom in, and check each packets' data, such as: Time, Total Packets, Severity, Top Protocols, Top Source IPs, Top Dest IPs, Top Dest Ports, TTL Distribution, Entropy Range.
- **Victim and attacker correlation graph:** After Victim and attacker graphs are uploaded, a correlation graph is shown.

# Parsing a file

The only accepted pcap format is .pcap.

## Usage

**Running the main code**
When in the main directory run:

```bash
npm install
```

**Running the Program**
To run run the application, open the index.html in VSCODE using the Microsoft Live preview to avoid CORS.

**Example: Main parsing function**

```javascript
/**
 * Main pcap parse function
 * @param  {object} buffer
 * @return {object} { packetsData, globalHeader } data of packets captured each second and their severity scores. Gloabl packet header data
 */
function parsePcap(buffer) {
  const view = new DataView(buffer);

  const globalHeader = extractGlobalHeader(view);

  let offset = 24;
  const packetsDataMap = new Map();

  while (offset < buffer.byteLength) {
    const { captureTimeIso, newOffset } = findPacketCaptureTimeInIso(
      view,
      offset
    );
    offset = newOffset;

    const inclLen = view.getUint32(offset, true);
    const packetStartOffset = offset + 8;
    const rawPacketData = new Uint8Array(buffer, packetStartOffset, inclLen);
    offset += 8 + inclLen;

    const parsedPacketData = parsePacketData(rawPacketData);

    const { protocol, srcPort, destPort, srcIP, destIP, ttl, payload } =
      parsedPacketData;

    const entropy = calculateEntropy(payload);
    const severity = assessSeverity(parsedPacketData);

    const packet = {
      protocol,
      srcIP,
      destIP,
      srcPort,
      destPort,
      ttl,
      payload,
      entropy,
      severity,
      timestamp: captureTimeIso,
    };

    findSamePacketsEachSecond(captureTimeIso, packetsDataMap, packet);
  }

  const packetsData = [...packetsDataMap.entries()]
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([time, { count, packets }]) => ({
      time: new Date(time),
      count,
      packets,
    }));

  return { packetsData, globalHeader };
}
```

We use the Javascript built-in DataView method, to initialize our buffer as a view object. We extract the global header, using the extractGlobalHeader() function, initialize our map where we will store our packet data. Intuitively, we use the offset method, 'chopping' each needed section of data that we eventually assign to the packet object. In the last step, we create the packetsData array, each having a key and value pair of our desired choice (time, count, packets).
