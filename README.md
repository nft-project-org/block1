ubuntu cargo problem:
https://stackoverflow.com/questions/72133316/ubuntu-22-04-libssl-so-1-1-cannot-open-shared-object-file-no-such-file-or-di
 {
  $ mkdir $HOME/opt && cd $HOME/opt
  $ wget https://www.openssl.org/source/openssl-1.1.1o.tar.gz
  $ tar -zxvf openssl-1.1.1o.tar.gz
  $ cd openssl-1.1.1o
  $ ./config && make && make test
  $ mkdir $HOME/opt/lib
  $ mv $HOME/opt/openssl-1.1.1o/libcrypto.so.1.1 $HOME/opt/lib/
  $ mv $HOME/opt/openssl-1.1.1o/libssl.so.1.1 $HOME/opt/lib/

  and then

  export LD_LIBRARY_PATH=$HOME/opt/lib:$LD_LIBRARY_PATH
}

public key can be retrieved by running following on project root:
$ solana address -k ./target/deploy/proj1-keypair.json


