class Cakemail < Formula
  desc "Official command-line interface for the Cakemail API"
  homepage "https://github.com/cakemail/cakemail-cli"
  url "https://registry.npmjs.org/@cakemail-org/cli/-/cli-1.1.1.tgz"
  sha256 "84a79c37895d6a239506f6e3a9b3a47903050643d2b2beea6f781dfc97535ba2"
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", *std_npm_args
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    # Test that binary exists and is executable
    assert_predicate bin/"cakemail", :exist?
    assert_predicate bin/"cakemail", :executable?
  end
end
