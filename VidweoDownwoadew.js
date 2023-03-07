// ==UserScript==
// @name         Vidweo Downwoadew
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Get ready to save some hot videos! 🔥 With this script, you can download any video from the current page without even leaving the site. 😎
// @match        https://www.pornhub.com/view_video.php*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    // Finds the flashvars_ variable from the window object.
    const flashvarsKey = Object.keys(window).find(key => key.startsWith('flashvars_'));
    if (!flashvarsKey) {
        alert('Video information not found on this page');
        throw new Error('flashvarsKey not found');
    }
    const videoData = eval(flashvarsKey).mediaDefinitions;

    // Finds the mp4 video URL from the mediaDefinitions array
    const mp4Data = videoData.find(info => info.format === 'mp4');
    if (!mp4Data) {
        alert('MP4 video URL not found');
        throw new Error('MP4 video URL not found');
    }
    const mp4Url = mp4Data.videoUrl;

    // Fetch the MP4 URL and get the JSON respons
    fetch(mp4Url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(json => {
            // Logs the video detaisl
            console.table(json.map(item => ({ quality: item.quality, url: item.videoUrl })));
            const infoContainer = document.createElement('div');
            infoContainer.id = 'video-downloader-info-dom';
            infoContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 99999;
            background: rgba(255, 255, 255, 0);
            color: #000;
            font-size: 1.5em;
            padding: 10px;
            background: #000;
            text-align: center;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
        `;

            const closeButton = document.createElement('button');
            closeButton.textContent = 'Close';
            closeButton.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 30px;
            line-height: 25px;
            font-size: 1.2em;
            font-weight: bold;
            font-align: center;
            color: #000;
            background: #ff9000;
            cursor: pointer;
        `;
            closeButton.addEventListener('click', () => {
                infoContainer.style.display = 'none';
            });

            const table = document.createElement('table');
            table.style.cssText = `
            display: inline-block;
            margin-top: 20px;
        `;

            const headerRow = document.createElement('tr');
            const qualityHeader = document.createElement('th');
            headerRow.appendChild(qualityHeader);

            const downloadHeader = document.createElement('th');
            headerRow.appendChild(downloadHeader);

            table.appendChild(headerRow);

            for (const item of json) {
                const row = document.createElement('tr');

                const qualityCell = document.createElement('td');
                qualityCell.textContent = item.quality;
                qualityCell.style.color = 'white';
                row.appendChild(qualityCell);

                const downloadCell = document.createElement('td');
                const downloadLink = document.createElement('a');
                downloadLink.href = item.videoUrl;
                downloadLink.target = '_blank';
                downloadLink.style.color = '#FF9000';
                downloadLink.style.textDecoration = 'none';
                downloadLink.textContent = 'Download';
                downloadCell.appendChild(downloadLink);
                row.appendChild(downloadCell);
                table.appendChild(row);
            }

            infoContainer.appendChild(table);
            infoContainer.appendChild(closeButton);
            document.body.appendChild(infoContainer);
        })
        .catch(error => {
            alert('Failed to fetch video information');
            console.error(error);
        });

})();
