{ pkgs ? import <nixos-unstable> {}}:
pkgs.mkShell {
    nativeBuildInputs = with pkgs; [ nodejs yarn gnumake pandoc s3cmd ];
}
