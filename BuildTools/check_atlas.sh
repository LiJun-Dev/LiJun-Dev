# find . -name "*.SD.spriteatlas" | xargs grep "m_CompressionQuality" -l | xargs sed -i '' 's/m_CompressionQuality\:[[:space:]][0-9]*$/m_CompressionQuality\: 0/g'

find . -type f ! -name "*SD.spriteatlas" -type f ! -name "*.meta" -type f -name "*.spriteatlas" | xargs grep -L "m_TextureFormat: 54"