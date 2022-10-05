public with sharing class NetToGrossComponent {
    @AuraEnabled(Cacheable=true)
    public static String getCurrentlyLoggedInUsersCountryCode(){
        try {
            User user = [SELECT Address FROM USER WHERE Id =: UserInfo.getUserId()];
            return user.Address.getCountryCode();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
