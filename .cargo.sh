export APPLE_ID="artemsem007@yandex.ru"
# export APPLE_PASSWORD="Master93ru"
export APPLE_PASSWORD="zmiu-kfgo-aanb-phjj"
export APPLE_SIGNING_IDENTITY="Developer ID Application: Artem Semenov (MVY72CHU7M)"
export APPLE_SIGNING_INSTALLER="Developer ID Installer: Artem Semenov (MVY72CHU7M)"
export APPLE_PROVIDER_SHORT_NAME="MVY72CHU7M"
export APPLE_PACKAGE_IDENTITY="dev.kmoz.bulkus-alpha"
export APPLE_PROVIDER_NAME="Artem Semenov|1542677489|1"
export APPLE_CERTIFICATE="$(cat certificate-base64.txt)"
export APPLE_CERTIFICATE_PASSWORD="WC67EoDe2RoKNbt"
xcrun altool -u "$APPLE_ID" -p "$APPLE_PASSWORD" --store-password-in-keychain-item "vpnworld"
# xcrun notarytool store-credentials --apple-id "$APPLE_ID" --password "$APPLE_PASSWORD" --sync --team-id "$APPLE_PROVIDER_SHORT_NAME" "bulkus"
export APPLE_API_KEY="$(cat ./.AuthKey_7HWYY5Y723.p8)"
export APPLE_API_ISSUER="c5640f0e-cc8f-4fd9-b50c-a201c112d652"