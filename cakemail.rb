class Cakemail < Formula
  desc "Official command-line interface for the Cakemail API"
  homepage "https://github.com/cakemail/cakemail-cli"
  url "https://registry.npmjs.org/@cakemail-org/cli/-/cli-1.1.2.tgz"
  sha256 "f8dec740e99f39c97489fc7f6d82529a59f5bf44fe05ea18fde2aefccdfb1fdb"
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
