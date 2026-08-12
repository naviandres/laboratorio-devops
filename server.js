const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
}

module.exports = app;