
import shutil
import sys
path = 'src/editor/export/' 
src =  'LocalExporter.js' if sys.argv[1] == 'nw' else 'Exporter.js'
shutil.copy(path + src, path + 'CopiedExporter.js')
