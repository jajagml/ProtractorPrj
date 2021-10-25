class BranchesPage {
    constructor()
    {
        this.branchNames = $$("app-branch-card .text-center span");
        this.branchAddress = $$("app-branch-card .text-center p");
    }

    VerifyNewBranchesInBranchesTab = (name,address) => {
        var isNameExist = this.branchNames.filter(function(elem, index){
            return elem.getText().then(function(text) {
                return text === name;
              });
       }).isPresent();

       var isAddressExist = this.branchAddress.filter(function(elem, index){
        return elem.getText().then(function(text) {
            return text === address;
          });
        }).isPresent();

        return isNameExist && isAddressExist;        
    }
}
module.exports = BranchesPage;