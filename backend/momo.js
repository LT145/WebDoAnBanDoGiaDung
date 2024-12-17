const express = require('express');
const crypto = require('crypto');
const https = require('https');
const router = express.Router();

// MoMo API parameters
const accessKey = 'F8BBA842ECF85';
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const partnerCode = 'MOMO';
const redirectUrl = 'http://localhost:5000/api/payment-result';
const ipnUrl ='/order-confirmation'
// const redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
// const ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
const requestType = "payWithMethod";
const lang = 'vi';

// MoMo Payment API
router.post('/create-payment', async (req, res) => {
    const { amount, orderInfo } = req.body;

    // Validate request body
    if (!amount || !orderInfo) {
        return res.status(400).json({ message: 'Amount and orderInfo are required' });
    }

    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const extraData = ''; // Optional, pass any custom data here

    // Create raw signature string
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    // Generate HMAC SHA256 signature
    const signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    // Create request body
    const requestBody = JSON.stringify({
        partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        lang,
        requestType,
        extraData,
        signature,
    });

    // HTTPS request options
    const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        }
    };

    // Send request to MoMo API
    const momoRequest = https.request(options, (momoResponse) => {
        let responseData = '';

        momoResponse.on('data', (chunk) => {
            responseData += chunk;
        });

        momoResponse.on('end', () => {
            try {
                const parsedResponse = JSON.parse(responseData);
                if (parsedResponse.resultCode === '0') {
                    // Payment creation success
                    return res.status(200).json(parsedResponse);
                } else {
                    return res.status(500).json({ message: 'Error processing MoMo response' });
                }
            } catch (error) {
                console.error('Error parsing response:', error);
                return res.status(500).json({ message: 'Error processing MoMo response' });
            }
        });
    });

    momoRequest.on('error', (error) => {
        console.error('Error with MoMo request:', error);
        return res.status(500).json({ message: 'Error connecting to MoMo API' });
    });

    momoRequest.write(requestBody);
    momoRequest.end();
});

router.get('/payment-result', (req, res) => {
    const { resultCode, message } = req.query;

    // Chuyển hướng dựa trên kết quả thanh toán
    if (resultCode === '0') {
        // Thanh toán thành công
        return res.redirect('http://localhost:3000/order-confirmation');
    } else {
        // Thanh toán thất bại, chuyển về trang localhost:3000 với thông báo lỗi
        return res.redirect(`http://localhost:3000/order?error=${encodeURIComponent(message || 'Thanh toán thất bại')}`);
    }
});

module.exports = router;
