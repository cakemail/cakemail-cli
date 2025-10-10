class Cakemail < Formula
  desc "Official command-line interface for the Cakemail API"
  homepage "https://github.com/cakemail/cakemail-cli"
  url "https://registry.npmjs.org/@cakemail-org/cli/-/cli-1.1.2.tgz"
  sha256 "5ab62c8f5beb5c73e7b60e6f21be7e1c3b1faa42db5aa46faa97fa3b1d8f4562"
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
