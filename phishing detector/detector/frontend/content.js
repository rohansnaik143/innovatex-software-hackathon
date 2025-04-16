function evaluateLinkSafety(href) {
    const hasIP = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(href);
    const isShort = href.length < 20;
    const hasAt = /@/.test(href);

    if (hasIP || hasAt) {
        return { verdict: "Phishing suspected", type: "danger", reason: "Suspicious URL pattern" };
    } else if (isShort) {
        return { verdict: "Unknown", type: "unknown", reason: "Shortened or unclear link" };
    } else {
        return { verdict: "This link is safe", type: "safe", reason: "Verified URL pattern" };
    }
}

function createHoverBox(e, data) {
    $('#link-hover-box').remove();

    let icon, bgColor;
    if (data.type === 'safe') {
        icon = '✔️';
        bgColor = '#28a745';
    } else if (data.type === 'danger') {
        icon = '⚠️';
        bgColor = '#dc3545';
    } else {
        icon = '❔';
        bgColor = '#6c757d';
    }

    const box = $(`
        <div id="link-hover-box" class="phoenix-hover-box">
            <div class="hover-box-header" style="background: ${bgColor};">
                <span class="hover-box-icon">${icon}</span>
                <span class="hover-box-text">${data.verdict}</span>
            </div>
           <div class="hover-box-body">
    <p>${data.reason}</p>
    <p style="margin-top: 5px; font-size: 12px; color: #777;">
        This information is provided by Phoenix phishing detector for your safety.
    </p>
</div>

            <div class="hover-box-footer">
                <img src="${chrome.runtime.getURL('phoenix.png')}" alt="Phoenix" />
                <span>Phoenix PhishingDetector</span>
            </div>
        </div>
    `);

    $('body').append(box);
    $('#link-hover-box').css({
        top: e.pageY + 10,
        left: e.pageX + 10
    });
}

function updateBoxPosition(e) {
    $('#link-hover-box').css({
        top: e.pageY + 10,
        left: e.pageX + 10
    });
}

function removeHoverBox() {
    $('#link-hover-box').remove();
}

function setupHover() {
    $(document).on('mouseenter', 'a[href]', function (e) {
        const href = $(this).attr('href');
        const data = evaluateLinkSafety(href);
        createHoverBox(e, data);
    });

    $(document).on('mousemove', 'a[href]', function (e) {
        updateBoxPosition(e);
    });

    $(document).on('mouseleave', 'a[href]', function () {
        removeHoverBox();
    });
}

function injectStyles() {
    const styles = `
    .phoenix-hover-box {
        position: absolute;
        z-index: 99999;
        width: 250px;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        font-family: Arial, sans-serif;
        background: #fff;
        border: 1px solid #ddd;
    }
    .hover-box-header {
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        padding: 10px;
        display: flex;
        align-items: center;
    }
    .hover-box-icon {
        font-size: 20px;
        margin-right: 10px;
    }
    .hover-box-body {
        padding: 10px;
        font-size: 13px;
    }
    .hover-box-body a {
        color: #007bff;
        text-decoration: underline;
        font-size: 12px;
    }
    .hover-box-footer {
        padding: 8px 10px;
        background: #f9f9f9;
        border-top: 1px solid #eee;
        font-size: 12px;
        color: #444;
        display: flex;
        align-items: center;
    }
    .hover-box-footer img {
        width: 16px;
        height: 16px;
        margin-right: 6px;
    }`;
    $('<style>').text(styles).appendTo('head');
}

$(document).ready(() => {
    injectStyles();
    setupHover();
});
