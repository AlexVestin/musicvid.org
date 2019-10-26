dest = "C:/Users/alex/Desktop/mvid_deps/"
platforms = ["windows64", "windows32", "linux"]
ext = {
    "windows64": "zip",
    "windows32": "zip",

    "linux": "gztar",
    "mac": "zip"
}

def copytree(src, dst, symlinks=False, ignore=None):
    for item in os.listdir(src):
        s = os.path.join(src, item)
        d = os.path.join(dst, item)
        if os.path.isdir(s):
            shutil.copytree(s, d, symlinks, ignore)
        else:
            shutil.copy2(s, d)

print("Copying files...")
import os
import shutil

src = './build'


sync_dir = dest + "build/"
if os.path.isdir(sync_dir):
    shutil.rmtree(sync_dir)
    os.makedirs(sync_dir)

for platform in platforms:
    build_dst =  dest + 'build_' + platform + "/musicvid.org/bin"
    if os.path.isdir(build_dst):
        try:
            shutil.rmtree(build_dst)
        except:
            pass
        print("Removing: ", build_dst)
    try:
        print("Copying to", build_dst)
        print(src, build_dst)
        shutil.copytree(src, build_dst)
        shutil.copy('./local/package.json', build_dst)
        copytree(dest + platform, build_dst)
        print("zipping to", sync_dir+platform)
        
        shutil.make_archive(sync_dir+'musicvid_'+platform, ext[platform], root_dir=dest + 'build_' + platform)

    # Directories are the same
    except shutil.Error as e:
        print('Directory not copied. Error: %s' % e)
    # Any error saying that the directory doesn't exist
    except OSError as e:
        print('Directory not copied. Error: %s' % e)

