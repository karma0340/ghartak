import fs from 'fs';
import path from 'path';

const walkSync = (dir, callback) => {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const filepath = path.join(dir, file);
        const stats = fs.statSync(filepath);
        if (stats.isDirectory()) {
            walkSync(filepath, callback);
        } else if (stats.isFile() && (filepath.endsWith('.js') || filepath.endsWith('.jsx'))) {
            callback(filepath);
        }
    });
};

const frontendSrcPath = path.join('e:', 'Internship', 'GharTk', 'frontend', 'src');

walkSync(frontendSrcPath, (filepath) => {
    let content = fs.readFileSync(filepath, 'utf8');
    
    // Replace fetch('/api/...) with fetch((import.meta.env.VITE_API_URL || "") + '/api/...)
    // Handling backticks: fetch(`/api/...) -> fetch(`${import.meta.env.VITE_API_URL || ""}/api/...)
    
    let updated = content;
    
    // Replace fetch('/api/
    updated = updated.replace(/fetch\('\/api\//g, 'fetch((import.meta.env.VITE_API_URL || "") + \'/api/');
    
    // Replace fetch(`/api/
    updated = updated.replace(/fetch\(`\/api\//g, 'fetch(`${import.meta.env.VITE_API_URL || ""}/api/');
    
    if (content !== updated) {
        fs.writeFileSync(filepath, updated, 'utf8');
        console.log(`Updated: ${filepath}`);
    }
});
