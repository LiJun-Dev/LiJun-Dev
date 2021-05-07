/******************************************************************************
 * StorageLevelItem
 *
 * Auto Generate File, Do NOT Modify!!!!!!!!!!!!!!!
 * Change template file or ask mingxu.zhang
 *****************************************************************************/

using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class StorageLevelItem : StorageItem
{
    
    /**
    * 
    */
    
    public  _;
    
    public  
    {
        get
        {
            return _;
        }
        set
        {
            IsDirty = true;
            _ = value;
        }
    }
    
    /**
    * 分数
    */
    
    public int _scores;
    
    public int scores
    {
        get
        {
            return _scores;
        }
        set
        {
            IsDirty = true;
            _scores = value;
        }
    }
    
    /**
    * 关卡玩的次数
    */
    
    public int _times;
    
    public int times
    {
        get
        {
            return _times;
        }
        set
        {
            IsDirty = true;
            _times = value;
        }
    }
    
}
