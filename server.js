const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 3000;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    console.log(`📨 ${req.method} ${req.url}`);
    
    // Parse URL
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    // Default to index.html
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // Get file path
    const filePath = path.join(__dirname, pathname);
    
    // Get file extension
    const ext = path.extname(filePath).toLowerCase();
    
    // Set Content-Type
    const contentType = mimeTypes[ext] || 'text/plain';
    
    // Read file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`
                    <html>
                        <head><title>404 - SAFYY</title></head>
                        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                            <h1 style="color: #2c3e50;">404 - Страница не найдена</h1>
                            <p>Запрошенная страница не существует.</p>
                            <a href="/" style="color: #2c3e50;">Вернуться на главную</a>
                        </body>
                    </html>
                `);
            } else {
                // Server error
                res.writeHead(500);
                res.end('Ошибка сервера: ' + err.code);
            }
        } else {
            // Success
            res.writeHead(200, { 
                'Content-Type': contentType + '; charset=utf-8',
                'Cache-Control': 'no-cache'
            });
            res.end(data);
        }
    });
});

server.listen(port, () => {
    console.log('🌈 ==================================');
    console.log('🛍️   SAFYY МАГАЗИН ОДЕЖДЫ');
    console.log('🌈 ==================================');
    console.log(`🚀 Сервер запущен: http://localhost:${port}`);
    console.log(`⏰ ${new Date().toLocaleString()}`);
    console.log('📁 Корневая папка:', __dirname);
    console.log('🌈 ==================================');
    console.log('📄 Главная страница: http://localhost:3000');
    console.log('🛍️  Каталог товаров: http://localhost:3000/catalog.html');
    console.log('🛒 Корзина: http://localhost:3000/cart.html');
    console.log('🔐 Вход/Регистрация: http://localhost:3000/login.html');
    console.log('🌈 ==================================');
    console.log('🛑 Для остановки: Ctrl + C');
    console.log('🌈 ==================================\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Останавливаем сервер...');
    server.close(() => {
        console.log('✅ Сервер остановлен. До свидания! 👋');
        process.exit(0);
    });
});