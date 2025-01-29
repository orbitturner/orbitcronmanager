export const scriptTemplates = {
  bash: {
    'Hello World': '#!/bin/bash\n\necho "Hello from OCM!"',
    'Current Date': '#!/bin/bash\n\ndate\necho "Current timestamp: $(date +%s)"',
    'System Info': '#!/bin/bash\n\necho "System Information:"\necho "----------------"\nuname -a\necho "\\nMemory Usage:"\nfree -h\necho "\\nDisk Usage:"\ndf -h',
    'Network Test': '#!/bin/bash\n\necho "Testing network connectivity..."\nping -c 4 google.com',
    'File Operations': '#!/bin/bash\n\necho "Creating test directory..."\nmkdir -p test_dir\ncd test_dir\necho "Hello World" > test.txt\nls -la\ncat test.txt',
    'Process List': '#!/bin/bash\n\necho "Current running processes:"\nps aux | head -n 10',
  },
  pwsh: {
    'Hello World': '# PowerShell Script\n\nWrite-Host "Hello from OCM!"',
    'Current Date': '# PowerShell Script\n\nGet-Date\nWrite-Host "Current timestamp: $([int](Get-Date -UFormat %s))"',
    'System Info': '# PowerShell Script\n\nWrite-Host "System Information:"\nWrite-Host "----------------"\nGet-ComputerInfo | Format-List\nWrite-Host "\\nMemory Usage:"\nGet-Counter "\\Memory\\Available MBytes"',
    'Network Test': '# PowerShell Script\n\nWrite-Host "Testing network connectivity..."\nTest-Connection -ComputerName google.com -Count 4',
    'File Operations': '# PowerShell Script\n\nWrite-Host "Creating test directory..."\nNew-Item -ItemType Directory -Path .\\test_dir -Force\nSet-Location .\\test_dir\n"Hello World" | Out-File test.txt\nGet-ChildItem\nGet-Content test.txt',
    'Process List': '# PowerShell Script\n\nWrite-Host "Current running processes:"\nGet-Process | Select-Object -First 10',
  }
};