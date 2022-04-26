const express = require('express');
const router = express.Router();

//--------------------------------------------------------//

router.get("/test-me", function (req, res) {
    res.send("My server is running awesome!")
})
//--------------------------------------------------------//



module.exports = router;