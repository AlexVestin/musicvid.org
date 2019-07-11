import json
with open('./src/util/version.js', 'r') as f:
    text = f.read()
    # 'export default ' == 15 in length
    info = json.loads(text[15:])

with open('./src/util/version.js', 'w') as f:

    from datetime import datetime
    time = datetime.now().strftime('%Y-%m-%d %H:%M')
    
    f.write('export default ' + json.dumps({"updated": time, "version":  str(int(info["version"]) + 1)}))
    
